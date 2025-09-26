/* 
 * ----------------------------------------------------------------------------
 * Autor: Miguel Andrés Suárez
 * Fecha: 2025-09-25
 * Archivo: SampleDocs.cs
 * Proyecto: Million Real Estate - Tests
 * ----------------------------------------------------------------------------
 * Descripción:
 * Fábricas de documentos BSON (Owner y Property) para poblar datos de prueba
 * de forma consistente en los tests.
 * ----------------------------------------------------------------------------
 */

using MongoDB.Bson;

namespace Million.Tests.Helpers
{
    public static class SampleDocs
    {
        /** Crea un documento de Owner con _id, name y address. */
        public static BsonDocument Owner(string id, string name) =>
            new BsonDocument
            {
                { "_id", new ObjectId(id) },
                { "name", name },
                { "address", "Owner St 1" }
            };

        /** Crea un documento de Property con imágenes de ejemplo y marcas de tiempo. */
        public static BsonDocument Property(string id, string ownerId, string name, decimal price) =>
            new BsonDocument
            {
                { "_id", new ObjectId(id) },
                { "OwnerId", new ObjectId(ownerId) },
                { "Name", name },
                { "Address", "Centro" },
                { "Price", price },
                { "Images", new BsonArray {
                    new BsonDocument { { "_id","img-1" }, { "File","https://picsum.photos/seed/a/800/600" }, { "Enabled", true } },
                    new BsonDocument { { "_id","img-2" }, { "File","https://picsum.photos/seed/b/800/600" }, { "Enabled", false } }
                }},
                { "CreatedAt", DateTime.UtcNow },
                { "UpdatedAt", DateTime.UtcNow }
            };
    }
}
