/**
 * ----------------------------------------------------------------------------
 * Autor: Miguel Andrés Suárez
 * Fecha: 2025-09-25
 * Archivo: src/app/hooks/useDebounce.ts
 * Proyecto: Million Real Estate - Frontend
 * ----------------------------------------------------------------------------
 * Descripción:
 * Hook de debounce simple para inputs controlados.
 * Evita realizar solicitudes con cada pulsación del usuario.
 * ----------------------------------------------------------------------------
 */
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 350) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}
