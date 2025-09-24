namespace Million.Infrastructure;

public class MongoOptions
{
    public string ConnectionString { get; set; } = "mongodb://localhost:27017";
    public string Database { get; set; } = "milliondb";
    public string PropertiesCollection { get; set; } = "properties";
}
