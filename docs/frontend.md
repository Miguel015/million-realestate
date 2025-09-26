# Frontend - Million Real Estate

Este documento describe la arquitectura, configuración y pruebas del frontend de **Million Real Estate**.

---

## Tecnologías usadas
- **Next.js 13 (App Router)**
- **React 18**
- **TypeScript**
- **TailwindCSS** (UI)
- **Framer Motion** (animaciones)
- **Vitest + Testing Library** (pruebas unitarias)

---

## Estructura del frontend

```
frontend/
├── src/
│   ├── app/
│   │   ├── property/[id]/page.tsx     # Vista detalle de propiedad
│   │   ├── lib/api.ts                 # Cliente API
│   │   ├── components/                # UI (PropertyCard, Filters, etc.)
│   │   └── page.tsx                   # Vista principal
│   └── test/                          # Pruebas unitarias
│       ├── PropertyCard.test.tsx
│       ├── api.fetchProperties.test.ts
│       ├── property.detail.page.test.tsx
│       ├── detail.placeholder.test.tsx
│       └── detail.thumb-nav.test.tsx
├── public/                            # Imágenes estáticas
├── tsconfig.json
├── tailwind.config.js
└── vitest.config.ts
```

---

## Configuración

1. Instalar dependencias:
   ```bash
   cd frontend
   npm install
   ```

2. Crear archivo `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5270
   ```

3. Ejecutar en modo desarrollo:
   ```bash
   npm run dev
   ```

4. Abrir en el navegador:
   ```
   http://localhost:3000
   ```

---

## Pruebas Frontend

1. Ejecutar todas:
   ```bash
   npm run test
   ```

2. Ejecutar en modo interactivo (watch):
   ```bash
   npx vitest
   ```

### Cobertura:
```bash
npx vitest run --coverage
```

---

## 📸 Funcionalidades

- **Página principal:** listado de propiedades con filtros y paginación.  
- **Detalle:** navegación con flechas ← → y thumbnails.  
- **Animaciones:** transiciones suaves entre vistas.  
- **Fallback de imágenes:** usa placeholder si no hay fotos.
