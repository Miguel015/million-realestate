using Mongo2Go;
using MongoDB.Driver;

namespace Million.Tests.Helpers
{
    public sealed class MongoFixture : IDisposable
    {
        private readonly MongoDbRunner _runner;
        public IMongoDatabase Database { get; }

        public MongoFixture()
        {
            _runner = MongoDbRunner.Start(singleNodeReplSet: true);
            var client = new MongoClient(_runner.ConnectionString);
            Database = client.GetDatabase("million_testdb");
        }

        public void Dispose() => _runner.Dispose();
    }
}
