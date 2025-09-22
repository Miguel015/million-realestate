import { notFound } from "next/navigation";

export type PropertyDto = {
  id?: string;
  _id?: string;
  idOwner: string;
  name: string;
  addressProperty: string;
  priceProperty: number;
  image: string;
};

export type Pagination = { page: number; pageSize: number; total?: number; totalPages?: number };
export type PropertiesResponse = { data: PropertyDto[]; pagination: Pagination };

function getBase(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error("NEXT_PUBLIC_API_BASE_URL no está definido (frontend/.env.local)");
  return base.replace(/\/+$/, "");
}

function isValidObjectId(id: string | null | undefined) {
  return typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
}

export async function fetchProperties(
  params: Record<string, string | number | undefined> = {}
): Promise<PropertiesResponse> {
  const base = getBase();
  const qs = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)])
  );
  const url = `${base}/api/Properties${qs.size ? `?${qs}` : ""}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Properties fetch failed: ${res.status} ${res.statusText}\n${text}`);
  }
  return res.json();
}

export async function fetchProperty(id: string): Promise<PropertyDto> {
  if (!isValidObjectId(id)) notFound();

  const base = getBase();
  const url = `${base}/api/Properties/${encodeURIComponent(id)}`;

  const res = await fetch(url, { cache: "no-store" });

  if (res.status === 404) {
    // console.error("[fetchProperty] 404 for", url);
    notFound();
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Property fetch failed: ${res.status} ${res.statusText}\n${text}`);
  }
  return res.json();
}
