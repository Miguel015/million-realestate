/**
 * ----------------------------------------------------------------------------
 * Autor: Miguel Andrés Suárez
 * Fecha: 2025-09-25
 * Archivo: IPropertyRepository.cs
 * Proyecto: Million Real Estate - Backend (Infrastructure)
 * ----------------------------------------------------------------------------
 * Descripción:
 * Contrato del repositorio de propiedades. Define operaciones para:
 * - Listar propiedades con filtros y paginación.
 * - Obtener una propiedad por Id.
 * Implementaciones concretas (MongoDB) deberían respetar esta interfaz.
 * ----------------------------------------------------------------------------
 */
 using Million.Domain;

namespace Million.Infrastructure.Repositories;

public interface IPropertyRepository
{
    Task<(IEnumerable<Property> data, int total, int totalPages)>
        GetPropertiesAsync(string? name, string? address, int? minPrice, int? maxPrice, int page, int pageSize);

    Task<Property?> GetByIdAsync(string id);
}
