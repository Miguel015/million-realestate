/**
 * ----------------------------------------------------------------------------
 * Autor: Miguel Andrés Suárez
 * Fecha: 2025-09-25
 * Archivo: Property.cs
 * Proyecto: Million Real Estate - Backend (Domain)
 * ----------------------------------------------------------------------------
 * Descripción:
 * Clase de dominio que representa una propiedad inmobiliaria.
 * Se utiliza en la capa de dominio para mapear los documentos de MongoDB 
 * mediante atributos de Bson.
 * 
 * Campos principales:
 * - Id: Identificador único en MongoDB.
 * - IdOwner: Identificador del propietario.
 * - Name: Nombre de la propiedad.
 * - AddressProperty: Dirección de la propiedad.
 * - PriceProperty: Precio de la propiedad.
 * - Image: URL de una imagen representativa.
 * ----------------------------------------------------------------------------
 */

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Million.Domain;

public class Property
{
    // Identificador único del documento en MongoDB
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = default!;

    // Referencia al propietario (Owner) de la propiedad
    public string IdOwner { get; set; } = string.Empty;

    // Nombre de la propiedad (ej: Hotel, Apartamento, etc.)
    public string Name { get; set; } = string.Empty;

    // Dirección de la propiedad (campo en Mongo: AddressProperty)
    public string AddressProperty { get; set; } = string.Empty;

    // Precio de la propiedad (numérico entero en la base de datos)
    public int PriceProperty { get; set; }

    // URL de una imagen representativa de la propiedad
    public string Image { get; set; } = string.Empty;
}
