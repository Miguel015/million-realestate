# Manual de Pruebas - Million Real Estate

Este documento describe los **casos de prueba manuales** para validar el sistema.

---

## Backend (API)

### ✅ CP01 - Listar propiedades
1. Ejecutar `GET /api/properties`.
2. Validar respuesta con `items[]` y `total`.

### ✅ CP02 - Filtros por nombre y dirección
1. Ejecutar `GET /api/properties?name=Hotel`.
2. Verificar que solo devuelva propiedades con ese nombre.

### ✅ CP03 - Rango de precios
1. `GET /api/properties?minPrice=500&maxPrice=1000`.
2. Validar que todas las propiedades cumplan el rango.

### ✅ CP04 - Detalle de propiedad
1. `GET /api/properties/{id}` con un `id` válido.
2. Validar campos: `id`, `name`, `address`, `price`, `images`, `owner`.

---

## Frontend (UI)

### ✅ CP05 - Cargar listado inicial
1. Abrir `http://localhost:3000`.
2. Verificar que se carguen propiedades.

### ✅ CP06 - Aplicar filtros
1. Filtrar por nombre y dirección.
2. Validar que solo se muestren los resultados esperados.

### ✅ CP07 - Navegar al detalle
1. Click en una tarjeta → abrir detalle.
2. Validar: nombre, dirección, precio, imágenes.

### ✅ CP08 - Navegación con flechas
1. Dentro del detalle, usar flechas ← y →.
2. Validar que cambie de propiedad.

### ✅ CP09 - Placeholder de imagen
1. Crear propiedad sin imágenes.
2. Validar que use `https://picsum.photos/...`.

---

## QA Técnica (Automatizadas)

- Unit tests backend (`dotnet test`).  
- Unit tests frontend (`npx vitest`).  
- Cobertura mínima: **80%**.  

---

## Casos de error

### ✅ CP10 - API retorna 404
1. Abrir `http://localhost:3000/property/{id_inexistente}`.
2. Validar mensaje: **“No encontrado”**.

### ✅ CP11 - API caída
1. Detener backend y abrir frontend.
2. Validar mensaje: **“Error al cargar”**.
