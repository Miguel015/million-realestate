// frontend/src/test/setup.ts
/// <reference types="vitest" />
import "@testing-library/jest-dom";

// ---- Mock estable de next/image (sin warnings en consola) ----
vi.mock("next/image", () => ({
  default: (props: any) => {
    const {
      alt = "",
      src = "",
      // quitamos props que <img> no entiende
      fill,
      priority,
      placeholder,
      blurDataURL,
      loader,
      sizes,
      ...rest
    } = props ?? {};
    return <img alt={alt} src={typeof src === "string" ? src : ""} {...rest} />;
  },
}));
