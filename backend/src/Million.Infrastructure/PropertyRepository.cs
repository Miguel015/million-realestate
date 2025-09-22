using Million.Domain.Entities;
using MongoDB.Driver;

namespace Million.Infrastructure.Repositories;

public class PropertyRepository : IPropertyRepository
{
    private readonly IMongoCollection<Property> _collection;

    public PropertyRepository(IMongoClient client, string databaseName)
    {
        var db = client.GetDatabase(databaseName);
        _collection = db.GetCollection<Property>("properties");
    }

    public async Task<IEnumerable<Property>> GetPropertiesAsync(string? name, string? address, decimal? minPrice, decimal? maxPrice, int page, int pageSize)
    {
        var filterBuilder = Builders<Property>.Filter;
        var filter = FilterDefinition<Property>.Empty;

        if (!string.IsNullOrWhiteSpace(name))
            filter &= filterBuilder.Regex(p => p.Name, new MongoDB.Bson.BsonRegularExpression(name, "i"));

        if (!string.IsNullOrWhiteSpace(address))
            filter &= filterBuilder.Regex(p => p.AddressProperty, new MongoDB.Bson.BsonRegularExpression(address, "i"));

        if (minPrice.HasValue)
            filter &= filterBuilder.Gte(p => p.PriceProperty, minPrice.Value);

        if (maxPrice.HasValue)
            filter &= filterBuilder.Lte(p => p.PriceProperty, maxPrice.Value);

        return await _collection
            .Find(filter)
            .Skip((page - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync();
    }

    public async Task<Property?> GetByIdAsync(string id)
    {
        return await _collection.Find(p => p.Id == id).FirstOrDefaultAsync();
    }
}
