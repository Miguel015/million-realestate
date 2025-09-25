using Xunit;
using FluentAssertions;
using MongoDB.Bson;
using MongoDB.Driver;
using Million.Infrastructure.Repositories;
using Million.Tests.Helpers;

namespace Million.Tests.Repositories;

public class PropertyRepositoryNotFoundTests : IDisposable
{
    private readonly MongoFixture _fx = new();
    private readonly PropertyRepository _repo;

    public PropertyRepositoryNotFoundTests()
    {
        _repo = new PropertyRepository(_fx.Database);

        // Base vacía: se inserta nada para la prueba
    }

    [Fact]
    public async Task GetDetail_returns_null_for_missing_id()
    {
        var missing = ObjectId.GenerateNewId().ToString();
        var detail = await _repo.GetDetailAsync(missing);
        detail.Should().BeNull();
    }

    public void Dispose() => _fx.Dispose();
}
