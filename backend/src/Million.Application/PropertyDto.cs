/**
 * ----------------------------------------------------------------------------
 * Autor: Miguel Andrés Suárez
 * Fecha: 2025-09-25
 * Archivo: PropertyDto.cs
 * Proyecto: Million Real Estate - Application
 * ----------------------------------------------------------------------------
 * Descripción:
 * DTO simple para exponer propiedades en escenarios donde el contrato usa
 * nomenclatura "AddressProperty" y "PriceProperty". Se utiliza típicamente
 * en capas intermedias o compatibilidad con modelos previos.
 * ----------------------------------------------------------------------------
 */

namespace Million.Application.Dtos;

public class PropertyDto
{
    // Identificador del Property (ObjectId como string)
    public string Id { get; set; } = string.Empty;

    // Identificador del Owner (ObjectId como string)
    public string IdOwner { get; set; } = string.Empty;

    // Nombre comercial o título de la propiedad
    public string Name { get; set; } = string.Empty;

    // Dirección en el esquema antiguo (AddressProperty)
    public string AddressProperty { get; set; } = string.Empty;

    // Precio en el esquema antiguo (PriceProperty)
    public decimal PriceProperty { get; set; }

    // URL de imagen principal o destacada
    public string Image { get; set; } = string.Empty;
}
