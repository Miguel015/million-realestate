/* 
 * ----------------------------------------------------------------------------
 * Autor: Miguel Andrés Suárez
 * Fecha: 2025-09-25
 * Archivo: PropertyRepositoryCombinedFiltersTests.cs
 * Proyecto: Million Real Estate - Tests
 * ----------------------------------------------------------------------------
 * Descripción:
 * Pruebas de combinación de filtros: nombre + address + rango de precios.
 * Incluye un helper inline para mutar el Address de un BsonDocument.
 * ----------------------------------------------------------------------------
 */

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

        /** Seed con direcciones diferentes y precios variados. */
        var ownerId = ObjectId.GenerateNewId().ToString();
        owners.InsertOne(SampleDocs.Owner(ownerId, "Owner Filters"));

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
        /** Act */
        var (items, total) = await _repo.GetPropertiesAsync(
            name: "hotel",
            address: "centro",
            minPrice: 180_000,
            maxPrice: 250_000,
            page: 1, pageSize: 50);

        /** Assert */
        total.Should().Be(1);
        items.Single().Name.Should().Be("Hotel Centro Uno");
        items.Single().Address.Should().Be("Centro");
    }

    public void Dispose() => _fx.Dispose();
}

/** 
 * Helper inline para setear una clave string en un BsonDocument 
 * sin reescribir la fábrica completa.
 */
static class BsonDocExt
{
    public static BsonDocument Set(this BsonDocument d, string key, string value)
    {
        d[key] = value;
        return d;
    }
}
