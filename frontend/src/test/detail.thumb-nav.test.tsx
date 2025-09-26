/**
 * ----------------------------------------------------------------------------
 * Autor: Miguel Andrés Suárez
 * Fecha: 2025-09-25
 * Archivo: src/test/detail.thumb-nav.test.tsx
 * Proyecto: Million Real Estate - Frontend (Tests)
 * ----------------------------------------------------------------------------
 * Descripción:
 * Verifica la navegación por thumbnails (prev/next) en la página de detalle.
 * Mockea router y lista de propiedades para simular el cambio de id.
 * ----------------------------------------------------------------------------
 */
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import React from "react";

/**
 * Hoist de fixtures y de un router espiado para poder referenciarlos
 * desde los factories de vi.mock (que son hoisted).
 */
const fixtures = vi.hoisted(() => ({
  items: [
    { id: "aaaaaaaaaaaaaaaaaaaaaaaa", name: "A", image: "img-a" },
    { id: "bbbbbbbbbbbbbbbbbbbbbbbb", name: "B", image: "img-b" },
  ],
}));

const spyRouter = vi.hoisted(() => ({
  push: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useParams: () => ({ id: fixtures.items[0].id }),
  useRouter: () => spyRouter,
}));

vi.mock("@/app/lib/api", () => ({
  fetchPropertyById: vi.fn().mockResolvedValue({
    id: fixtures.items[0].id,
    idOwner: "owner",
    name: "Hotel A",
    address: "Av. 1",
    price: 100,
    images: ["img-a"],
    owner: { id: "o1", name: "O", address: "X" },
    traces: [],
  }),
  fetchProperties: vi.fn().mockResolvedValue({
    data: fixtures.items,
    pagination: { totalPages: 1 },
  }),
}));

import PropertyPage from "@/app/property/[id]/page";

describe("Property detail thumbnails navigation", () => {
  it("al hacer click en el segundo thumbnail navega al id correspondiente", async () => {
    const user = userEvent.setup();
    render(<PropertyPage /> as any);

    // espera a que cargue el detalle
    await screen.findByText("Hotel A");

    // contenedor de thumbnails
    const scroller = screen.getByText("More properties").parentElement!;
    const btns = within(scroller).getAllByRole("button");

    // click en el segundo thumbnail
    await user.click(btns[1]);

    expect(spyRouter.push).toHaveBeenCalledWith(
      `/property/${fixtures.items[1].id}`
    );
  });
});
