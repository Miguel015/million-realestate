using Xunit;
using FluentAssertions;
using MongoDB.Bson;
using MongoDB.Driver;
using Million.Infrastructure.Repositories;
using Million.Tests.Helpers;

namespace Million.Tests.Repositories
{
    public class PropertyRepositoryDetailTests : IDisposable
    {
        private readonly MongoFixture _fx = new();
        private readonly PropertyRepository _repo;

        private readonly string _ownerId = ObjectId.GenerateNewId().ToString();
        private readonly string _propId  = ObjectId.GenerateNewId().ToString();

        public PropertyRepositoryDetailTests()
        {
            _repo = new PropertyRepository(_fx.Database);

            var owners = _fx.Database.GetCollection<BsonDocument>("owners");
            var props  = _fx.Database.GetCollection<BsonDocument>("properties");

            owners.InsertOne(SampleDocs.Owner(_ownerId, "Juan Pérez"));

            var p = SampleDocs.Property(_propId, _ownerId, "Hotel Centro", 320_000);
            p["Images"].AsBsonArray.Add(new BsonDocument {
                { "_id","img-x" }, { "File","https://picsum.photos/seed/x/800/600" }, { "Enabled", false }
            });
            props.InsertOne(p);
        }

        [Fact]
        public async Task Detail_returns_owner_and_enabled_images()
        {
            var d = await _repo.GetDetailAsync(_propId);
            d.Should().NotBeNull();
            d!.Name.Should().Be("Hotel Centro");
            d.Owner.Name.Should().Be("Juan Pérez");
            d.Images.Should().NotBeEmpty();
            d.Images.Should().OnlyContain(x => x.StartsWith("http"));
        }

        public void Dispose() => _fx.Dispose();
    }
}
