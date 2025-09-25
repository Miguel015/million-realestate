using Xunit;
using FluentAssertions;
using MongoDB.Bson;
using MongoDB.Driver;
using Million.Infrastructure.Repositories;
using Million.Tests.Helpers;

namespace Million.Tests.Repositories
{
    public class PropertyRepositoryFiltersTests : IDisposable
    {
        private readonly MongoFixture _fx = new();
        private readonly PropertyRepository _repo;

        public PropertyRepositoryFiltersTests()
        {
            _repo = new PropertyRepository(_fx.Database);

            var owners = _fx.Database.GetCollection<BsonDocument>("owners");
            var props  = _fx.Database.GetCollection<BsonDocument>("properties");

            var ownerId = ObjectId.GenerateNewId().ToString();
            owners.InsertOne(SampleDocs.Owner(ownerId, "Alice"));

            props.InsertMany(new[]
            {
                SampleDocs.Property(ObjectId.GenerateNewId().ToString(), ownerId, "Hotel Azul",  200_000),
                SampleDocs.Property(ObjectId.GenerateNewId().ToString(), ownerId, "Hotel Verde", 500_000),
                SampleDocs.Property(ObjectId.GenerateNewId().ToString(), ownerId, "Hostal Rojo", 150_000),
            });
        }

        [Fact]
        public async Task Filters_by_name_case_insensitive()
        {
            var (items, total) = await _repo.GetPropertiesAsync("azul", null, null, null, 1, 10);

            total.Should().Be(1);
            items.Should().ContainSingle(x => x.Name.Contains("Azul"));
        }

        [Fact]
        public async Task Filters_by_price_range()
        {
            var (items, total) = await _repo.GetPropertiesAsync(null, null, 180_000, 400_000, 1, 10);

            total.Should().Be(1);
            items[0].Name.Should().Be("Hotel Azul");
            items[0].Price.Should().BeGreaterThan(0);
        }

        public void Dispose() => _fx.Dispose();
    }
}
