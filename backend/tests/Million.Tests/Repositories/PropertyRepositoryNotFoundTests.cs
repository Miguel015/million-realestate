/* 
 * ----------------------------------------------------------------------------
 * Autor: Miguel Andrés Suárez
 * Fecha: 2025-09-25
 * Archivo: PropertyRepositoryNotFoundTests.cs
 * Proyecto: Million Real Estate - Tests
 * ----------------------------------------------------------------------------
 * Descripción:
 * Prueba de detalle con id inexistente: el repositorio debe devolver null.
 * ----------------------------------------------------------------------------
 */

using Xunit;
using FluentAssertions;
using MongoDB.Bson;
using MongoDB.Driver;
using Million.Infrastructure.Repositories;

namespace Million.Tests.Repositories;

public class PropertyRepositoryNotFoundTests : IDisposable
{
    private readonly MongoFixture _fx = new();
    private readonly PropertyRepository _repo;

    public PropertyRepositoryNotFoundTests()
    {
        _repo = new PropertyRepository(_fx.Database);

        /** No se inserta data: la base queda vacía a propósito. */
    }

    [Fact]
    public async Task GetDetail_returns_null_for_missing_id()
    {
        /** Arrange */
        var missing = ObjectId.GenerateNewId().ToString();

        /** Act */
        var detail = await _repo.GetDetailAsync(missing);

        /** Assert */
        detail.Should().BeNull();
    }

    public void Dispose() => _fx.Dispose();
}
