/**
 * ----------------------------------------------------------------------------
 * Autor: Miguel Andrés Suárez
 * Fecha: 2025-09-25
 * Archivo: src/test/Filters.test.tsx
 * Proyecto: Million Real Estate - Frontend (Tests)
 * ----------------------------------------------------------------------------
 * Descripción:
 * Pruebas unitarias del componente Filters.
 * Verifica llamadas a handlers onSearch y onClear, y a los setters de inputs.
 * ----------------------------------------------------------------------------
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// Mock simple de framer-motion
vi.mock("framer-motion", () => {
  const React = require("react");
  const passthrough = (Tag: any) =>
    React.forwardRef((p: any, r: any) => <Tag ref={r} {...p} />);
  return {
    motion: { div: passthrough("div"), section: passthrough("section") },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

// ⚠️ IMPORTA Filters según como lo exportes en el componente
import Filters from "@/app/components/Filters"; // <-- si es default export
// import { Filters } from "@/app/components/Filters"; // <-- usa esta línea si es named export

describe("Filters", () => {
  it("llama onSearch y onClear", async () => {
    const user = userEvent.setup();

    const props = {
      name: "",
      address: "",
      minPrice: "",
      maxPrice: "",
      setName: vi.fn(),
      setAddress: vi.fn(),
      setMinPrice: vi.fn(),
      setMaxPrice: vi.fn(),
      onSearch: vi.fn(),
      onClear: vi.fn(),
      busy: false,
    };

    render(<Filters {...props} />);

    // Cambiamos algunos campos para comprobar que llama a los setters
    // Ajusta los placeholders/labels a los que tenga tu UI
    const nameInput = screen.getByPlaceholderText(/name/i);
    await user.type(nameInput, "Hotel");
    expect(props.setName).toHaveBeenCalled();

    const addressInput = screen.getByPlaceholderText(/address/i);
    await user.type(addressInput, "Av.");
    expect(props.setAddress).toHaveBeenCalled();

    // Click en Search
    const searchBtn = screen.getByRole("button", { name: /search/i });
    await user.click(searchBtn);
    expect(props.onSearch).toHaveBeenCalled();

    // Click en Clear
    const clearBtn = screen.getByRole("button", { name: /clear/i });
    await user.click(clearBtn);
    expect(props.onClear).toHaveBeenCalled();
  });
});
