using Microsoft.AspNetCore.Mvc;
using Million.Infrastructure.Repositories;

namespace Million.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PropertiesController : ControllerBase
{
    private readonly PropertyRepository _repo;
    public PropertiesController(PropertyRepository repo) => _repo = repo;

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
        return Ok(new { items, total, page, pageSize });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken ct)
    {
        var dto = await _repo.GetDetailAsync(id, ct);
        return dto is null ? NotFound() : Ok(dto);
    }
}
