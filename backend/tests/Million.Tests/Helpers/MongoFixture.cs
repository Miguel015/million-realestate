/* 
 * ----------------------------------------------------------------------------
 * Autor: Miguel Andrés Suárez
 * Fecha: 2025-09-25
 * Archivo: MongoFixture.cs
 * Proyecto: Million Real Estate - Tests
 * ----------------------------------------------------------------------------
 * Descripción:
 * Fixture de MongoDB para pruebas: crea una base de datos aislada por ejecución,
 * entrega IMongoDatabase a los tests y limpia los recursos al finalizar.
 * ----------------------------------------------------------------------------
 */

using MongoDB.Driver;

namespace Million.Tests.Helpers
{
    public class MongoFixture : IDisposable
    {
        /** Cliente y base de datos temporales para el ciclo de vida del test. */
        public IMongoDatabase Database { get; }
        private readonly MongoClient _client;
        private readonly string _dbName;

        public MongoFixture()
        {
            /** Conexión local por defecto; ajustable mediante variables de entorno si se requiere. */
            var conn = Environment.GetEnvironmentVariable("TEST_MONGO") ?? "mongodb://localhost:27017";
            _client = new MongoClient(conn);

            /** Nombre único de base para aislar datasets entre pruebas. */
            _dbName = $"million_tests_{Guid.NewGuid():N}";
            Database = _client.GetDatabase(_dbName);
        }

        public void Dispose()
        {
            /** Elimina la base temporal creada para la sesión de pruebas. */
            _client.DropDatabase(_dbName);
        }
    }
}
