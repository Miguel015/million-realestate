/**
 * ----------------------------------------------------------------------------
 * Autor: Miguel Andrés Suárez
 * Fecha: 2025-09-25
 * Archivo: src/test/api.fetchProperties.test.ts
 * Proyecto: Million Real Estate - Frontend (Tests)
 * ----------------------------------------------------------------------------
 * Descripción:
 * Prueba unitaria de cliente HTTP (fetchProperties):
 * valida que construye la URL con querystring y parsea la respuesta.
 * ----------------------------------------------------------------------------
 */
import { fetchProperties } from "@/app/lib/api";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5270";

describe("fetchProperties", () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = vi.fn(async (url: string) =>
      new Response(JSON.stringify({
        items: [],
        total: 0,
        page: 1,
        pageSize: 12,
      }), { status: 200, headers: { "Content-Type": "application/json" } })
    );
  });

  it("construye el query string sin poner 'undefined'", async () => {
    await fetchProperties({ name: "hotel", page: 2, pageSize: 12 });
    expect(global.fetch).toHaveBeenCalledTimes(1);

    const calledUrl = (global.fetch as any).mock.calls[0][0] as string;
    expect(calledUrl.startsWith(`${BASE}/api/properties?`)).toBe(true);
    expect(calledUrl).toContain("name=hotel");
    expect(calledUrl).toContain("page=2");
    expect(calledUrl).toContain("pageSize=12");
    expect(calledUrl).not.toContain("undefined");
  });
});
