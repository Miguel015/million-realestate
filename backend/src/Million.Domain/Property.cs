using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Million.Domain.Entities;

[BsonIgnoreExtraElements]
public class Property
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)] // <-- convierte el ObjectId de Mongo a string automáticamente
    public string Id { get; set; } = string.Empty;

    public string IdOwner { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string AddressProperty { get; set; } = string.Empty;
    public decimal PriceProperty { get; set; }
    public string Image { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
