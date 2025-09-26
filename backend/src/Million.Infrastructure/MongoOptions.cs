/**
 * ----------------------------------------------------------------------------
 * Autor: Miguel Andrés Suárez
 * Fecha: 2025-09-25
 * Archivo: MongoOptions.cs
 * Proyecto: Million Real Estate - Backend (Infrastructure)
 * ----------------------------------------------------------------------------
 * Descripción:
 * POCO de opciones para configurar la conexión a MongoDB desde appsettings.
 * Se utiliza en Program.cs para bindear configuración y construir el cliente.
 * ----------------------------------------------------------------------------
 */

namespace Million.Infrastructure;

public class MongoOptions
{
    // Cadena de conexión a MongoDB (host/puerto/credenciales)
    public string ConnectionString { get; set; } = "mongodb://localhost:27017";

    // Nombre de la base de datos a usar
    public string Database { get; set; } = "milliondb";

    // Nombre de la colección donde se guardan las propiedades
    public string PropertiesCollection { get; set; } = "properties";
}
