using System.Text.Json.Serialization;

namespace Million.Application.Contracts;

public class PropertyDetailDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = "";

    [JsonPropertyName("idOwner")]
    public string IdOwner { get; set; } = "";

    [JsonPropertyName("name")]
    public string Name { get; set; } = "";

    [JsonPropertyName("address")]
    public string Address { get; set; } = "";

    [JsonPropertyName("price")]
    public decimal Price { get; set; }

    [JsonPropertyName("images")]
    public List<string> Images { get; set; } = new();

    [JsonPropertyName("owner")]
    public OwnerMiniDto Owner { get; set; } = new();

    [JsonPropertyName("traces")]
    public List<TraceMiniDto> Traces { get; set; } = new();
}

public class OwnerMiniDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = "";

    [JsonPropertyName("name")]
    public string Name { get; set; } = "";

    [JsonPropertyName("address")]
    public string Address { get; set; } = "";
}

public class TraceMiniDto
{
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("dateSale")]
    public string? DateSale { get; set; }

    [JsonPropertyName("value")]
    public decimal? Value { get; set; }

    [JsonPropertyName("tax")]
    public decimal? Tax { get; set; }
}
