using MongoDB.Bson;

namespace Million.Tests.Helpers
{
    public static class SampleDocs
    {
        public static BsonDocument Owner(string id, string name) =>
            new BsonDocument
            {
                { "_id", new ObjectId(id) },
                { "name", name },
                { "address", "Owner St 1" }
            };

        public static BsonDocument Property(string id, string ownerId, string name, decimal price) =>
            new BsonDocument
            {
                { "_id", new ObjectId(id) },
                { "OwnerId", new ObjectId(ownerId) },
                { "Name", name },
                { "Address", "Centro" },
                { "Price", price },
                { "Images", new BsonArray {
                    new BsonDocument { { "_id","img-1" }, { "File","https://picsum.photos/seed/a/800/600" }, { "Enabled", true } },
                    new BsonDocument { { "_id","img-2" }, { "File","https://picsum.photos/seed/b/800/600" }, { "Enabled", false } }
                }},
                { "CreatedAt", DateTime.UtcNow },
                { "UpdatedAt", DateTime.UtcNow }
            };
    }
}
