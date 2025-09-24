using MongoDB.Driver;
using Million.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// CORS para el front en localhost:3000
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontCors", p =>
        p.WithOrigins("http://localhost:3000")
         .AllowAnyHeader()
         .AllowAnyMethod());
});

// Mongo (desde appsettings.Development.json)
var mongo = builder.Configuration.GetSection("Mongo");
builder.Services.AddSingleton<IMongoClient>(_ => new MongoClient(mongo["ConnectionString"]!));
builder.Services.AddSingleton(sp => sp.GetRequiredService<IMongoClient>().GetDatabase(mongo["Database"]!));

// Repo
builder.Services.AddScoped<PropertyRepository>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("FrontCors");
app.MapControllers();

app.Run();
