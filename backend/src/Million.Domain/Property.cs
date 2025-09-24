using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Million.Domain;

public class Property
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = default!;

    public string IdOwner { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;

    // En tu seed este campo se llama "AddressProperty"
    public string AddressProperty { get; set; } = string.Empty;

    // En tu seed es numérico entero
    public int PriceProperty { get; set; }

    public string Image { get; set; } = string.Empty;
}
