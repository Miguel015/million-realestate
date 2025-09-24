using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using Million.Application.Contracts;

namespace Million.Infrastructure.Repositories
{
    public class PropertyRepository
    {
        private readonly IMongoCollection<BsonDocument> _props;
        private readonly IMongoCollection<BsonDocument> _owners;

        public PropertyRepository(IMongoDatabase db)
        {
            _props  = db.GetCollection<BsonDocument>("properties");
            _owners = db.GetCollection<BsonDocument>("owners");
        }

        // Listado: id, idOwner, name, address, price, image
        public async Task<(IReadOnlyList<PropertyListDto> items, long total)> GetPropertiesAsync(
            string? name, string? address, decimal? minPrice, decimal? maxPrice,
            int page, int pageSize, CancellationToken ct = default)
        {
            var match = new BsonDocument();
            var and = new List<BsonDocument>();

            if (!string.IsNullOrWhiteSpace(name))
                and.Add(new BsonDocument("Name", new BsonDocument("$regex", name).Add("$options", "i")));

            if (!string.IsNullOrWhiteSpace(address))
                and.Add(new BsonDocument("Address", new BsonDocument("$regex", address).Add("$options", "i")));

            if (minPrice.HasValue)
                and.Add(new BsonDocument("Price", new BsonDocument("$gte", minPrice.Value)));

            if (maxPrice.HasValue)
                and.Add(new BsonDocument("Price", new BsonDocument("$lte", maxPrice.Value)));

            if (and.Count > 0) match.Add("$and", new BsonArray(and));

            var skip = Math.Max(0, (page - 1) * pageSize);

            var pipeline = new[]
            {
                new BsonDocument("$match", match),

                new BsonDocument("$addFields", new BsonDocument("FirstEnabledImage",
                    new BsonDocument("$first",
                        new BsonDocument("$filter", new BsonDocument
                        {
                            { "input", "$Images" },
                            { "as", "img" },
                            { "cond", new BsonDocument("$eq", new BsonArray { "$$img.Enabled", true }) }
                        })
                    )
                )),

                new BsonDocument("$project", new BsonDocument
                {
                    { "id", new BsonDocument("$toString", "$_id") },            // ← id del property
                    { "idOwner", new BsonDocument("$toString", "$OwnerId") },
                    { "name", "$Name" },
                    { "address", "$Address" },
                    { "price", "$Price" },
                    { "image", "$FirstEnabledImage.File" }
                }),

                new BsonDocument("$facet", new BsonDocument
                {
                    { "items", new BsonArray {
                        new BsonDocument("$sort", new BsonDocument("_id", -1)),
                        new BsonDocument("$skip", skip),
                        new BsonDocument("$limit", pageSize)
                    }},
                    { "count", new BsonArray { new BsonDocument("$count", "total") } }
                })
            };

            var cursor = await _props.AggregateAsync<BsonDocument>(pipeline, cancellationToken: ct);
            var raw = await cursor.FirstOrDefaultAsync(ct);

            var items = new List<PropertyListDto>();
            if (raw != null && raw.Contains("items"))
            {
                foreach (var bv in raw["items"].AsBsonArray)
                {
                    var doc = bv.AsBsonDocument;

                    decimal price;
                    var pv = doc["price"];
                    if (pv.IsDecimal128)      price = (decimal)pv.AsDecimal128;
                    else if (pv.IsInt64)      price = pv.AsInt64;
                    else if (pv.IsInt32)      price = pv.AsInt32;
                    else                      price = (decimal)pv.ToDouble();

                    items.Add(new PropertyListDto
                    {
                        Id      = doc["id"].AsString,          // ← ahora viene en el listado
                        IdOwner = doc["idOwner"].AsString,
                        Name    = doc["name"].AsString,
                        Address = doc["address"].AsString,
                        Price   = price,
                        Image   = (doc.Contains("image") && !doc["image"].IsBsonNull) ? doc["image"].AsString : null
                    });
                }
            }

            long total = 0;
            if (raw != null && raw.Contains("count"))
            {
                var countArr = raw["count"].AsBsonArray;
                if (countArr.Count > 0)
                {
                    var cdoc = countArr[0].AsBsonDocument;
                    if (cdoc.Contains("total")) total = cdoc["total"].ToInt64();
                }
            }

            return (items, total);
        }

        // Detalle: id, idOwner, name, address, price, images[], owner{}, traces[]
        public async Task<PropertyDetailDto?> GetDetailAsync(string id, CancellationToken ct = default)
        {
            var oid = ObjectId.Parse(id);

            var pipeline = new[]
            {
                new BsonDocument("$match", new BsonDocument("_id", oid)),

                new BsonDocument("$lookup", new BsonDocument
                {
                    { "from", "owners" },
                    { "localField", "OwnerId" },
                    { "foreignField", "_id" },
                    { "as", "ownerDoc" }
                }),

                new BsonDocument("$unwind", new BsonDocument
                {
                    { "path", "$ownerDoc" },
                    { "preserveNullAndEmptyArrays", true }
                }),

                new BsonDocument("$addFields", new BsonDocument("EnabledImages",
                    new BsonDocument("$map", new BsonDocument
                    {
                        { "input", new BsonDocument("$filter", new BsonDocument {
                            { "input", "$Images" },
                            { "as", "img" },
                            { "cond", new BsonDocument("$eq", new BsonArray { "$$img.Enabled", true }) }
                        })},
                        { "as", "im" },
                        { "in", "$$im.File" }
                    })
                )),

                new BsonDocument("$project", new BsonDocument
                {
                    { "id", new BsonDocument("$toString", "$_id") },
                    { "idOwner", new BsonDocument("$toString", "$OwnerId") },
                    { "name", "$Name" },
                    { "address", "$Address" },
                    { "price", "$Price" },
                    { "images", "$EnabledImages" },
                    { "owner", new BsonDocument
                        {
                            { "id", new BsonDocument("$toString", "$ownerDoc._id") },
                            { "name", "$ownerDoc.name" },
                            { "address", "$ownerDoc.address" }
                        }
                    },
                    { "traces", new BsonArray() }
                })
            };

            var cur = await _props.AggregateAsync<BsonDocument>(pipeline, cancellationToken: ct);
            var d = await cur.FirstOrDefaultAsync(ct);
            if (d == null) return null;

            decimal price;
            var pv = d["price"];
            if (pv.IsDecimal128)      price = (decimal)pv.AsDecimal128;
            else if (pv.IsInt64)      price = pv.AsInt64;
            else if (pv.IsInt32)      price = pv.AsInt32;
            else                      price = (decimal)pv.ToDouble();

            var dto = new PropertyDetailDto
            {
                Id      = d["id"].AsString,
                IdOwner = d["idOwner"].AsString,
                Name    = d["name"].AsString,
                Address = d["address"].AsString,
                Price   = price,
                Images  = d.Contains("images") && d["images"].IsBsonArray
                          ? d["images"].AsBsonArray.Select(x => x.AsString).ToList()
                          : new List<string>(),
                Owner   = new OwnerMiniDto
                {
                    Id      = d.Contains("owner") && d["owner"].AsBsonDocument.Contains("id")
                              ? d["owner"].AsBsonDocument["id"].AsString
                              : "",
                    Name    = d.Contains("owner") && d["owner"].AsBsonDocument.Contains("name")
                              ? d["owner"].AsBsonDocument["name"].AsString
                              : "",
                    Address = d.Contains("owner") && d["owner"].AsBsonDocument.Contains("address")
                              ? d["owner"].AsBsonDocument["address"].AsString
                              : ""
                },
                Traces = new List<TraceMiniDto>()
            };

            return dto;
        }
    }
}
