/**
 * ----------------------------------------------------------------------------
 * Autor: Miguel Andrés Suárez
 * Fecha: 2025-09-25
 * Archivo: PropertyDetailDto.cs
 * Proyecto: Million Real Estate - Application (Contracts)
 * ----------------------------------------------------------------------------
 * Descripción:
 * Contrato de salida para el detalle de una propiedad. Incluye datos del
 * propietario, lista de imágenes habilitadas y trazas (historial).
 * Atributos JsonPropertyName aseguran el shape JSON esperado por el front.
 * ----------------------------------------------------------------------------
 */

using System.Text.Json.Serialization;

namespace Million.Application.Contracts;

public class PropertyDetailDto
{
    // Id del property (ObjectId serializado como string)
    [JsonPropertyName("id")]
    public string Id { get; set; } = "";

    // Id del owner (ObjectId serializado como string)
    [JsonPropertyName("idOwner")]
    public string IdOwner { get; set; } = "";

    // Nombre de la propiedad
    [JsonPropertyName("name")]
    public string Name { get; set; } = "";

    // Dirección de la propiedad
    [JsonPropertyName("address")]
    public string Address { get; set; } = "";

    // Precio actual de la propiedad
    [JsonPropertyName("price")]
    public decimal Price { get; set; }

    // URLs de imágenes habilitadas
    [JsonPropertyName("images")]
    public List<string> Images { get; set; } = new();

    // Datos mínimos del propietario
    [JsonPropertyName("owner")]
    public OwnerMiniDto Owner { get; set; } = new();

    // Historial de operaciones/valores (si aplica)
    [JsonPropertyName("traces")]
    public List<TraceMiniDto> Traces { get; set; } = new();
}

// Sub-DTO con datos mínimos del propietario
public class OwnerMiniDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = "";

    [JsonPropertyName("name")]
    public string Name { get; set; } = "";

    [JsonPropertyName("address")]
    public string Address { get; set; } = "";
}

// Sub-DTO para trazas/historial de la propiedad
public class TraceMiniDto
{
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    // Fecha de la transacción/registro en formato serializado
    [JsonPropertyName("dateSale")]
    public string? DateSale { get; set; }

    // Valor de la transacción/registro
    [JsonPropertyName("value")]
    public decimal? Value { get; set; }

    // Impuesto asociado
    [JsonPropertyName("tax")]
    public decimal? Tax { get; set; }
}
