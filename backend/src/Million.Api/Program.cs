/**
 * ----------------------------------------------------------------------------
 * Autor: Miguel Andrés Suárez
 * Fecha: 2025-09-25
 * Archivo: Program.cs
 * Proyecto: Million Real Estate - Backend (API)
 * ----------------------------------------------------------------------------
 * Descripción:
 * Punto de entrada de la API. Configura DI, CORS, MongoDB, Swagger y mapea los
 * controladores. No se modifica la lógica original, solo se documenta.
 * ----------------------------------------------------------------------------
 */

using MongoDB.Driver;
using Million.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// CORS para el front en localhost:3000
// Política "FrontCors" que permite headers y métodos desde el origen del frontend.
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontCors", p =>
        p.WithOrigins("http://localhost:3000")
         .AllowAnyHeader()
         .AllowAnyMethod());
});

// Mongo (desde appsettings.Development.json)
// Registra IMongoClient y el IMongoDatabase a partir de la sección "Mongo".
var mongo = builder.Configuration.GetSection("Mongo");
builder.Services.AddSingleton<IMongoClient>(_ => new MongoClient(mongo["ConnectionString"]!));
builder.Services.AddSingleton(sp => sp.GetRequiredService<IMongoClient>().GetDatabase(mongo["Database"]!));

// Repo
// Se registra el repositorio concreto que usa IMongoDatabase internamente.
builder.Services.AddScoped<PropertyRepository>();

// MVC + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Middleware de Swagger UI para explorar la API durante el desarrollo.
app.UseSwagger();
app.UseSwaggerUI();

// Habilita la política CORS definida para permitir llamadas desde el frontend.
app.UseCors("FrontCors");

// Mapea controladores por atributos (route-based).
app.MapControllers();

// Inicia la aplicación web.
app.Run();
