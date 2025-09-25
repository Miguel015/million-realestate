using Xunit;
using FluentAssertions;
using MongoDB.Bson;
using MongoDB.Driver;
using Million.Infrastructure.Repositories;
using Million.Tests.Helpers;

namespace Million.Tests.Repositories;

public class PropertyRepositoryCombinedFiltersTests : IDisposable
{
    private readonly MongoFixture _fx = new();
    private readonly PropertyRepository _repo;

    public PropertyRepositoryCombinedFiltersTests()
    {
        _repo = new PropertyRepository(_fx.Database);

        var owners = _fx.Database.GetCollection<BsonDocument>("owners");
        var props  = _fx.Database.GetCollection<BsonDocument>("properties");

        var ownerId = ObjectId.GenerateNewId().ToString();
        owners.InsertOne(SampleDocs.Owner(ownerId, "Owner Filters"));

        // Centro y Playa, con distintos precios
        props.InsertMany(new[]
        {
            SampleDocs.Property(ObjectId.GenerateNewId().ToString(), ownerId, "Hotel Centro Uno", 200_000).Set("Address","Centro"),
            SampleDocs.Property(ObjectId.GenerateNewId().ToString(), ownerId, "Hotel Centro Dos", 300_000).Set("Address","Centro"),
            SampleDocs.Property(ObjectId.GenerateNewId().ToString(), ownerId, "Hotel Playa Uno",  220_000).Set("Address","Playa"),
        });
    }

    [Fact]
    public async Task Combines_name_address_and_price_range()
    {
        var (items, total) = await _repo.GetPropertiesAsync(
            name: "hotel",        // por nombre (case-insensitive)
            address: "centro",    // por address
            minPrice: 180_000,    // rango
            maxPrice: 250_000,
            page: 1, pageSize: 50);

        total.Should().Be(1);
        items.Single().Name.Should().Be("Hotel Centro Uno");
        items.Single().Address.Should().Be("Centro");
    }

    public void Dispose() => _fx.Dispose();
}

// pequeña extensión para setear Address sin reescribir factory
static class BsonDocExt
{
    public static BsonDocument Set(this BsonDocument d, string key, string value)
    {
        d[key] = value;
        return d;
    }
}
