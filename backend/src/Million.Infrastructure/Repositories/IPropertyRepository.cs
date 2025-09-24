using Million.Domain;

namespace Million.Infrastructure.Repositories;

public interface IPropertyRepository
{
    Task<(IEnumerable<Property> data, int total, int totalPages)>
        GetPropertiesAsync(string? name, string? address, int? minPrice, int? maxPrice, int page, int pageSize);

    Task<Property?> GetByIdAsync(string id);
}
