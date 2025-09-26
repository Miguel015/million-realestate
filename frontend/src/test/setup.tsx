/**
 * ----------------------------------------------------------------------------
 * Autor: Miguel Andrés Suárez
 * Fecha: 2025-09-25
 * Archivo: src/test/setup.tsx
 * Proyecto: Million Real Estate - Frontend (Tests)
 * ----------------------------------------------------------------------------
 * Descripción:
 * Setup global para Vitest + React Testing Library.
 * Registra jest-dom y provee mocks seguros (p. ej. next/image) para evitar
 * warnings/errores en el entorno de pruebas con jsdom.
 * ----------------------------------------------------------------------------
 */
/// <reference types="vitest" />
import "@testing-library/jest-dom";

// ---- Mock estable de next/image (sin warnings en consola) ----
vi.mock("next/image", () => ({
  default: (props: any) => {
    const {
      alt = "",
      src = "",
      // quitamos props que <img> no entiende
      fill,
      priority,
      placeholder,
      blurDataURL,
      loader,
      sizes,
      ...rest
    } = props ?? {};
    return <img alt={alt} src={typeof src === "string" ? src : ""} {...rest} />;
  },
}));
