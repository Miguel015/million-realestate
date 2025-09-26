/**
 * ----------------------------------------------------------------------------
 * Autor: Miguel Andrés Suárez
 * Fecha: 2025-09-25
 * Archivo: src/test/property.detail.page.test.tsx
 * Proyecto: Million Real Estate - Frontend (Tests)
 * ----------------------------------------------------------------------------
 * Descripción:
 * Pruebas de la página de detalle de propiedad.
 * Mockea navegación de Next, framer-motion y API.
 * Verifica renderizado de datos y manejo de estado 404.
 * ----------------------------------------------------------------------------
 */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// ⚠️ Mocks locales (evitan el “Element type is invalid”)
vi.mock("next/image", () => ({
  default: (props: any) => {
    // renderiza un <img> normal
    // next/image exige alt, así que garantizamos un string
    const { alt = "", ...rest } = props ?? {};
    return <img alt={alt} {...rest} />;
  },
}));

vi.mock("next/link", () => ({
  default: ({ children, ...rest }: any) => <a {...rest}>{children}</a>,
}));

vi.mock("framer-motion", () => {
  const React = require("react");
  const passthrough = (Tag: any) =>
    React.forwardRef((p: any, r: any) => <Tag ref={r} {...p} />);
  return {
    motion: {
      div: passthrough("div"),
      section: passthrough("section"),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

// Mocks de next/navigation para params y router
vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "66ff20a0b3c1d24b8e9a1111" }),
  useRouter: () => ({ push: vi.fn() }),
}));

// Mocks de la API usada por la página
vi.mock("@/app/lib/api", () => ({
  fetchPropertyById: vi.fn(),
  fetchProperties: vi.fn().mockResolvedValue({ data: [] }),
}));

import PropertyPage from "@/app/property/[id]/page";
import { fetchPropertyById } from "@/app/lib/api";

describe("Property detail page", () => {
  it("muestra nombre, dirección e imágenes", async () => {
    (fetchPropertyById as any).mockResolvedValueOnce({
      id: "66ff20a0b3c1d24b8e9a1111",
      idOwner: "owner1",
      name: "Hotel Luna Azul",
      address: "Av. Costera 123",
      price: 345000,
      images: ["https://picsum.photos/seed/h1/1200/900"],
      owner: { id: "owner1", name: "Juan", address: "—" },
      traces: [],
    });

    render(<PropertyPage /> as any);

    // Espera a que cargue el detalle (useEffect)
    expect(await screen.findByText("Hotel Luna Azul")).toBeInTheDocument();
    expect(screen.getByText("Av. Costera 123")).toBeInTheDocument();
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("muestra 'No encontrado' cuando la API responde 404", async () => {
    (fetchPropertyById as any).mockRejectedValueOnce(new Error("NOT_FOUND"));

    render(<PropertyPage /> as any);

    expect(await screen.findByText(/no encontrado/i)).toBeInTheDocument();
  });
});
