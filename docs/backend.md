# Backend - Million Real Estate

Este documento describe la arquitectura, configuración y pruebas del backend de **Million Real Estate**.

---

## Tecnologías usadas
- **.NET 8 / ASP.NET Core Web API**
- **MongoDB** (almacenamiento de propiedades y dueños)
- **Swagger** (documentación de endpoints)
- **xUnit + FluentAssertions** (pruebas unitarias)
- **Docker (opcional)** para levantar MongoDB

---

## Estructura del backend

```
backend/
├── src/
│   ├── Million.Api/               # API principal
│   │   ├── Controllers/           # Controladores REST
│   │   └── Program.cs             # Configuración inicial
│   ├── Million.Application/       # DTOs y contratos
│   ├── Million.Domain/            # Entidades de dominio (Property, Owner, etc.)
│   └── Million.Infrastructure/    # Conexión con Mongo + repositorios
├── tests/
│   └── Million.Tests/             # Pruebas unitarias xUnit
```

---

## Configuración

1. Clonar el repositorio y entrar al backend:
   ```bash
   cd backend
   ```

2. Configurar variables de entorno en `appsettings.json`:
   ```json
   {
     "Mongo": {
       "ConnectionString": "mongodb://localhost:27017",
       "Database": "milliondb",
       "PropertiesCollection": "properties"
     },
     "Logging": {
       "LogLevel": {
         "Default": "Information",
         "Microsoft.AspNetCore": "Warning"
       }
     },
     "AllowedHosts": "*"
   }
   ```

3. Restaurar dependencias:
   ```bash
   dotnet restore
   ```

4. Levantar el servidor:
   ```bash
   dotnet run --project src/Million.Api
   ```

5. Abrir Swagger:
   ```
   http://localhost:5270/swagger
   ```

---

## 📡 Endpoints principales

### Listar propiedades
```
GET /api/properties
```
- Parámetros: `name`, `address`, `minPrice`, `maxPrice`, `page`, `pageSize`

### Obtener detalle de propiedad
```
GET /api/properties/{id}
```

### Crear propiedad
```
POST /api/properties
```

---

## Pruebas

### Unitarias (xUnit)
```bash
cd backend/tests/Million.Tests
dotnet test
```

Ejemplos incluidos:
- `PropertyRepositoryTests.cs` → consulta y detalle de propiedades.  
- `OwnerRepositoryTests.cs` → validación de dueños.

### Cobertura
Opcional:
```bash
dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=lcov
```
Genera reporte para integrarlo con CI/CD.
