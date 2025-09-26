/**
 * ----------------------------------------------------------------------------
 * Autor: Miguel Andrés Suárez
 * Fecha: 2025-09-25
 * Archivo: src/app/lib/api.ts
 * Proyecto: Million Real Estate - Frontend
 * ----------------------------------------------------------------------------
 * Descripción:
 * Cliente HTTP del frontend. Expone funciones para consumir el backend:
 * - fetchProperties: listado con filtros/paginación
 * - fetchPropertyById: detalle por id
 * Depende de NEXT_PUBLIC_API_URL para construir las URLs.
 * ----------------------------------------------------------------------------
 */
// ---------- Tipos que usa tu UI ----------
export type PropertyDto = {
  id: string;
  idOwner: string;
  name: string;
  address: string;
  price: number;
  image?: string | null;
};

export type PropertiesResponse = {
  data: PropertyDto[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};

export type PropertyDetailDto = {
  id: string;
  idOwner: string;
  name: string;
  address: string;
  price: number;
  images: string[];
  owner: { id: string; name: string; address: string };
  traces: Array<{ name?: string; dateSale?: string; value?: number; tax?: number }>;
};

// ---------- Helpers ----------
const BASE = process.env.NEXT_PUBLIC_API_URL!;
if (!BASE) {
  // ayuda a detectar .env no cargado
  // eslint-disable-next-line no-console
  console.error("NEXT_PUBLIC_API_URL no está definido (frontend/.env.local)");
}

function sanitizeParams(input: Record<string, any>) {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(input)) {
    // elimina null/undefined, strings vacíos y literales "undefined"/"null"
    if (v === undefined || v === null) continue;
    if (typeof v === "string") {
      const trimmed = v.trim();
      if (!trimmed || trimmed.toLowerCase() === "undefined" || trimmed.toLowerCase() === "null") continue;
      out[k] = trimmed;
    } else {
      out[k] = String(v);
    }
  }
  return out;
}

// ---------- API ----------
export async function fetchProperties(params: Record<string, any> = {}): Promise<PropertiesResponse> {
  const clean = sanitizeParams(params);
  const qs = new URLSearchParams(clean).toString();
  const url = `${BASE}/api/properties${qs ? `?${qs}` : ""}`;
  // console.log("fetchProperties URL =>", url);

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

  // backend: { items, total, page, pageSize }
  const json: { items: any[]; total: number; page: number; pageSize: number } = await res.json();

  return {
    data: (json.items || []) as PropertyDto[],
    pagination: {
      total: json.total ?? 0,
      page: json.page ?? 1,
      pageSize: json.pageSize ?? 12,
      totalPages: Math.max(1, Math.ceil((json.total ?? 0) / (json.pageSize ?? 12))),
    },
  };
}

export async function fetchPropertyById(id: string): Promise<PropertyDetailDto> {
  const url = `${BASE}/api/properties/${id}`;
  // console.log("fetchPropertyById URL =>", url);

  const res = await fetch(url, { cache: "no-store" });
  if (res.status === 404) throw new Error("NOT_FOUND");
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export const fetchProperty = fetchPropertyById;
