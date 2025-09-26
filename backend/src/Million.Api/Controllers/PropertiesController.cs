/**
 * ----------------------------------------------------------------------------
 * Autor: Miguel Andrés Suárez
 * Fecha: 2025-09-25
 * Archivo: PropertiesController.cs
 * Proyecto: Million Real Estate - Backend (API)
 * ----------------------------------------------------------------------------
 * Descripción:
 * Controlador HTTP para exponer endpoints de propiedades:
 * - GET /api/properties           → listado con filtros y paginación
 * - GET /api/properties/{id}      → detalle por identificador
 * Utiliza PropertyRepository (capa Infrastructure) para acceder a MongoDB.
 * No se modifica la lógica original, solo se documenta.
 * ----------------------------------------------------------------------------
 */

using Microsoft.AspNetCore.Mvc;
using Million.Infrastructure.Repositories;

namespace Million.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PropertiesController : ControllerBase
{
    // Repositorio de acceso a datos (inyectado por DI en Program.cs)
    private readonly PropertyRepository _repo;
    public PropertiesController(PropertyRepository repo) => _repo = repo;

    /// <summary>
    /// Listado de propiedades con filtros (name, address, minPrice, maxPrice) y paginación.
    /// </summary>
    /// <param name="name">Filtro por nombre (contains, case-insensitive)</param>
    /// <param name="address">Filtro por dirección (contains, case-insensitive)</param>
    /// <param name="minPrice">Precio mínimo</param>
    /// <param name="maxPrice">Precio máximo</param>
    /// <param name="page">Número de página (1-based)</param>
    /// <param name="pageSize">Tamaño de página</param>
    /// <param name="ct">Cancellation token</param>
    /// <returns>Objeto anónimo con items, total, page y pageSize</returns>
    [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] string? name,
        [FromQuery] string? address,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12,
        CancellationToken ct = default)
    {
        var (items, total) = await _repo.GetPropertiesAsync(name, address, minPrice, maxPrice, page, pageSize, ct);
        // Se devuelve el shape esperado por el frontend para la grilla de propiedades.
        return Ok(new { items, total, page, pageSize });
    }

    /// <summary>
    /// Detalle de una propiedad por su Id.
    /// </summary>
    /// <param name="id">Identificador del documento en MongoDB (ObjectId en string)</param>
    /// <param name="ct">Cancellation token</param>
    /// <returns>200 con DTO de detalle o 404 si no existe</returns>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken ct)
    {
        var dto = await _repo.GetDetailAsync(id, ct);
        return dto is null ? NotFound() : Ok(dto);
    }
}
