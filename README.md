# Million Real Estate

Aplicación full-stack para gestión de propiedades inmobiliarias.  
Construida con **Next.js (Frontend)**, **.NET 8 (Backend)** y **MongoDB (Base de datos)**.  

Incluye **pruebas unitarias y de integración** en backend (NUnit) y frontend (Vitest + React Testing Library).  

Este repositorio incluye documentación técnica organizada en secciones:  

- [Documentación Backend](docs/backend.md)
- [Documentación Frontend](docs/frontend.md)
- [Manual de Pruebas](docs/manual-tests.md)

Además, puedes acceder a la **documentación extendida con diagramas, flujos de arquitectura y casos de uso completos** en el siguiente enlace externo:  

[Documentación Detallada del Proyecto](https://deepwiki.com/Miguel015/million-realestate)

---


## Estructura del Proyecto

```
million-realestate/
│── backend/                 # API .NET 8 + MongoDB
│   ├── src/                 # Código fuente de la API
│   └── tests/               # Pruebas unitarias backend
│
│── frontend/                # Aplicación cliente Next.js
│   ├── src/                 # Código fuente (pages, components)
│   └── src/test/            # Pruebas unitarias frontend
│
│── infra/                   # Scripts de infraestructura y seed de datos
│   └── seed/                # Poblar MongoDB con datos iniciales
│
│
│── doc/                   # Documentacion detallada
│   └── backend              # Documentación Detallada Backend
│   └── frontend             # Documentación Detallada Frontend
│   └── manual-tests         # Manual de pruebas
│
└── README.md                # Documentación principal
```

---

## Requisitos

- Node.js >= 18  
- .NET 8 SDK  
- MongoDB local o Atlas (cloud)  

---

## Levantar el Proyecto

### 1. Clonar el repositorio
```bash
git clone https://github.com/usuario/million-realestate.git
cd million-realestate
```

### 2. Backend (API)
```bash
cd backend/src/Million.Api
dotnet restore
dotnet run
```
- API disponible en --> `http://localhost:5270/swagger`

### 3. Base de Datos (Mongo)
Ejecutar seed para poblar datos:
```bash
cd infra/seed
node seed.js
```

### 4. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
- Frontend disponible en --> `http://localhost:3000`

---

## Ejecución de Pruebas

### Backend (NUnit + FluentAssertions)
```bash
cd backend/tests/Million.Tests
dotnet test
```

### Frontend (Vitest + React Testing Library)
```bash
cd frontend
npm run test
```

### Cobertura
- **Backend:**  
  ```bash
  dotnet test --collect:"XPlat Code Coverage"
  ```
- **Frontend:**  
  ```bash
  npm run test:cov
  ```

---

## Funcionalidades probadas

### Backend
- Repositorio de propiedades:  
  - Consulta detalle por ID.  
  - Filtrado por precio, dirección o nombre.  
- Integración MongoDB en memoria (Mongo2Go) para pruebas.  

### Frontend
- `PropertyCard` renderiza nombre, dirección y precio.  
- `PropertyDetailPage` muestra detalle de propiedad y fallback “No encontrado”.  
- Uso de **placeholder** cuando no hay imágenes.  
- Navegación por thumbnails entre propiedades.  
- Componente `Filters` ejecuta `onSearch` y `onClear`.  

---

## Stack Tecnológico

- **Frontend:** Next.js, React, TailwindCSS, Vitest, React Testing Library.  
- **Backend:** .NET 8, C#, MongoDB, NUnit, FluentAssertions.  
- **Infraestructura:** Node.js scripts para seed, Swagger para API docs.  

---

## Autor
**Miguel Andrés Suárez Peña**
