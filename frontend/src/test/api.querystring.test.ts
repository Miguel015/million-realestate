import { describe, it, expect, vi } from "vitest";
import { fetchProperties } from "@/app/lib/api";

describe("api querystring limpio", () => {
  it("no incluye parámetros undefined", async () => {
    const spy = vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ items: [], total: 0, page: 1, pageSize: 12 }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    );

    await fetchProperties({
      name: undefined,
      address: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      page: 1,
      pageSize: 12,
    });

    const calledUrl = new URL((spy.mock.calls[0]![0] as string));
    expect(calledUrl.searchParams.get("name")).toBeNull();
    expect(calledUrl.searchParams.get("address")).toBeNull();
    expect(calledUrl.searchParams.get("minPrice")).toBeNull();
    expect(calledUrl.searchParams.get("maxPrice")).toBeNull();
  });
});
