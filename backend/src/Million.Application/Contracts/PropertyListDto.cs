/**
 * ----------------------------------------------------------------------------
 * Autor: Miguel Andrés Suárez
 * Fecha: 2025-09-25
 * Archivo: PropertyListDto.cs
 * Proyecto: Million Real Estate - Application (Contracts)
 * ----------------------------------------------------------------------------
 * Descripción:
 * Contrato de salida para el listado de propiedades. Este shape coincide con
 * lo que consume el frontend en la grilla: campos con nombres en minúscula
 * y una imagen opcional para la tarjeta.
 * ----------------------------------------------------------------------------
 */

using System.Text.Json.Serialization;

namespace Million.Application.Contracts;

public class PropertyListDto
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

    // Dirección para visualización/búsqueda
    [JsonPropertyName("address")]
    public string Address { get; set; } = "";

    // Precio que se muestra en la tarjeta/listado
    [JsonPropertyName("price")]
    public decimal Price { get; set; }

    // URL de imagen principal en el listado (puede ser null)
    [JsonPropertyName("image")]
    public string? Image { get; set; }
}
