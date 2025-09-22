using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson; // para ObjectId.TryParse
using Million.Infrastructure.Repositories; // ajusta si tu interfaz está en otro namespace
using Million.Domain; // si usas tipos del dominio

namespace Million.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PropertiesController : ControllerBase
{
    private readonly IPropertyRepository _repo;

    public PropertiesController(IPropertyRepository repo)
    {
        _repo = repo;
    }

    // GET /api/Properties?name=&address=&minPrice=&maxPrice=&page=&pageSize=
    [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] string? name,
        [FromQuery] string? address,
        [FromQuery] int? minPrice,
        [FromQuery] int? maxPrice,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12)
    {
        // Ajusta a tu contrato real del repo
        var result = await _repo.GetPropertiesAsync(new PropertyQuery
        {
            Name = name,
            Address = address,
            MinPrice = minPrice,
            MaxPrice = maxPrice,
            Page = page,
            PageSize = pageSize
        });

        return Ok(result);
    }

    // GET /api/Properties/{id}  (solo coincide con 24 hex)
    [HttpGet("{id:length(24)}")]
    public async Task<IActionResult> GetById(string id)
    {
        // extra-safe: si no parsea como ObjectId, 404
        if (!ObjectId.TryParse(id, out _))
            return NotFound();

        var prop = await _repo.GetByIdAsync(id);
        if (prop is null) return NotFound();

        return Ok(prop);
    }
}
