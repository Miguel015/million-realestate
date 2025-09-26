/**
 * ----------------------------------------------------------------------------
 * Autor: Miguel Andrés Suárez
 * Fecha: 2025-09-25
 * Archivo: src/test/api.errors.test.ts
 * Proyecto: Million Real Estate - Frontend (Tests)
 * ----------------------------------------------------------------------------
 * Descripción:
 * Pruebas unitarias del cliente API.
 * Valida el manejo de errores HTTP y el caso de 404 específico.
 * ----------------------------------------------------------------------------
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchProperties, fetchPropertyById } from "@/app/lib/api";

const BASE = process.env.NEXT_PUBLIC_API_URL!;

describe("api errors", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetchProperties propaga error de red", async () => {
    const err = new TypeError("NetworkError");
    vi.spyOn(global, "fetch").mockRejectedValueOnce(err);

    await expect(
      fetchProperties({ name: "x", page: 1, pageSize: 12 })
    ).rejects.toThrowError("NetworkError");
    expect(global.fetch).toHaveBeenCalledOnce();
  });

  it("fetchPropertyById lanza NOT_FOUND si 404", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response("", { status: 404 })
    );

    await expect(fetchPropertyById("66ff20a0b3c1d24b8e9a1111")).rejects.toThrow(
      "NOT_FOUND"
    );
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/api/properties/66ff20a0b3c1d24b8e9a1111`,
      { cache: "no-store" }
    );
  });
});
