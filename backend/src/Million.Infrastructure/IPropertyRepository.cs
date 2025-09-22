using Million.Domain.Entities;

namespace Million.Infrastructure.Repositories;

public interface IPropertyRepository
{
    Task<IEnumerable<Property>> GetPropertiesAsync(string? name, string? address, decimal? minPrice, decimal? maxPrice, int page, int pageSize);
    Task<Property?> GetByIdAsync(string id);
}
