/**
 * ----------------------------------------------------------------------------
 * Autor: Miguel Andrés Suárez
 * Fecha: 2025-09-25
 * Archivo: src/test/PropertyCard.test.tsx
 * Proyecto: Million Real Estate - Frontend (Tests)
 * ----------------------------------------------------------------------------
 * Descripción:
 * Pruebas unitarias del componente PropertyCard.
 * Verifica renderizado de nombre, dirección, precio e imagen.
 * ----------------------------------------------------------------------------
 */
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom";

import PropertyCard from "@/app/components/PropertyCard";
import type { PropertyDto } from "@/app/lib/api";

const money = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);

describe("PropertyCard", () => {
  const item: PropertyDto = {
    id: "66ff20a0b3c1d24b8e9a1111",
    idOwner: "66ff20a0b3c1d24b8e9a2222",
    name: "Hotel Luna Azul",
    address: "Av. Costera 123",
    price: 345000,
    image: "https://picsum.photos/seed/hotel/800/600",
  };

  it("renderiza nombre, dirección y precio", () => {
    render(<PropertyCard p={item} qName="" qAddress="" />);
    expect(screen.getByText(item.name)).toBeInTheDocument();
    expect(screen.getByText(item.address)).toBeInTheDocument();
    expect(screen.getByText(`$${money(item.price)}`)).toBeInTheDocument();
    expect(screen.getByRole("img")).toBeInTheDocument();
  });
});
