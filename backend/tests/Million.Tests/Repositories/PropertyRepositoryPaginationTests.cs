/* 
 * ----------------------------------------------------------------------------
 * Autor: Miguel Andrés Suárez
 * Fecha: 2025-09-25
 * Archivo: PropertyRepositoryPaginationTests.cs
 * Proyecto: Million Real Estate - Tests
 * ----------------------------------------------------------------------------
 * Descripción:
 * Pruebas de paginación: verifica el total y la cantidad de ítems devueltos
 * según page y pageSize.
 * ----------------------------------------------------------------------------
 */

using Xunit;
using FluentAssertions;
using MongoDB.Bson;
using MongoDB.Driver;
using Million.Infrastructure.Repositories;
using Million.Tests.Helpers;

namespace Million.Tests.Repositories;

public class PropertyRepositoryPaginationTests : IDisposable
{
    private readonly MongoFixture _fx = new();
    private readonly PropertyRepository _repo;

    public PropertyRepositoryPaginationTests()
    {
        _repo = new PropertyRepository(_fx.Database);

        var owners = _fx.Database.GetCollection<BsonDocument>("owners");
        var props  = _fx.Database.GetCollection<BsonDocument>("properties");

        /** Seed de 25 propiedades para probar la segmentación por páginas. */
        var ownerId = ObjectId.GenerateNewId().ToString();
        owners.InsertOne(SampleDocs.Owner(ownerId, "Owner Pag"));

        var many = Enumerable.Range(1, 25).Select(i =>
            SampleDocs.Property(ObjectId.GenerateNewId().ToString(), ownerId, $"Hotel #{i}", 100_000 + i)
        );
        props.InsertMany(many);
    }

    [Fact]
    public async Task Returns_total_and_respects_pageSize()
    {
        /** Act: pageSize=10, page=2 */
        var (items, total) = await _repo.GetPropertiesAsync(
            name: null, address: null, minPrice: null, maxPrice: null,
            page: 2, pageSize: 10);

        /** Assert */
        total.Should().Be(25);
        items.Count.Should().Be(10);
    }

    public void Dispose() => _fx.Dispose();
}
