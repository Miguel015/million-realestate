import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "aaaaaaaaaaaaaaaaaaaaaaaa" }),
  useRouter: () => ({ push: vi.fn() }),
}));

// Respuesta de detalle sin imágenes
vi.mock("@/app/lib/api", () => ({
  fetchPropertyById: vi.fn().mockResolvedValue({
    id: "aaaaaaaaaaaaaaaaaaaaaaaa",
    idOwner: "owner",
    name: "Hotel Sin Fotos",
    address: "Av. 9",
    price: 999,
    images: [],
    owner: { id: "o1", name: "O", address: "X" },
    traces: [],
  }),
  // lista mínima para thumbnails
  fetchProperties: vi.fn().mockResolvedValue({
    data: [{ id: "aaaaaaaaaaaaaaaaaaaaaaaa", name: "X", image: "" }],
    pagination: { totalPages: 1 },
  }),
}));

import PropertyPage from "@/app/property/[id]/page";

describe("Property detail placeholder image", () => {
  it("usa el placeholder cuando no hay imágenes", async () => {
    render(<PropertyPage /> as any);

    // espera a que se renderice el detalle
    await screen.findByText("Hotel Sin Fotos");

    // selecciona SOLO la imagen principal del detalle por su alt
    const hero = screen.getByAltText("Hotel Sin Fotos") as HTMLImageElement;
    expect(hero.getAttribute("src") || "").toContain(
      "https://picsum.photos/seed/placeholder/1200/900"
    );
  });
});
