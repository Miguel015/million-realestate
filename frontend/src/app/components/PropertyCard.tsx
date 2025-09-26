/**
 * ----------------------------------------------------------------------------
 * Autor: Miguel Andrés Suárez
 * Fecha: 2025-09-25
 * Archivo: src/app/components/PropertyCard.tsx
 * Proyecto: Million Real Estate - Frontend
 * ----------------------------------------------------------------------------
 * Descripción:
 * Tarjeta de propiedad para el grid del Home.
 * Muestra imagen, nombre, dirección y precio.
 * Enlace a la página de detalle.
 * ----------------------------------------------------------------------------
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { PropertyDto } from "@/app/lib/api";

const currency = (v?: number | string | null) => {
  const n = typeof v === "number" ? v : v ? Number(v) : NaN;
  if (!Number.isFinite(n)) return "$0";
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
};

export default function PropertyCard({
  p,
  qName,
  qAddress,
}: {
  p: PropertyDto;
  qName?: string;
  qAddress?: string;
}) {
  const href = `/property/${p.id}`;
  const img = p.image ?? "https://picsum.photos/seed/hotel/800/600";

  return (
    <motion.article
      layout
      className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/70"
    >
      <Link href={href} className="block">
        <div className="relative aspect-[4/3]">
          <Image
            src={img}
            alt={p.name}
            fill
            sizes="(max-width:768px) 100vw, 25vw"
            className="object-cover transition-transform group-hover:scale-[1.02]"
            priority={false}
          />
          <span className="absolute left-2 top-2 rounded-md bg-emerald-600/80 px-2 py-0.5 text-[10px] font-semibold">
            New
          </span>
        </div>

        <div className="p-3">
          <h3 className="line-clamp-1 text-sm font-semibold">{p.name}</h3>
          <p className="mt-1 line-clamp-1 text-xs text-zinc-400">{p.address}</p>
          <div className="mt-2 text-sm font-semibold">{currency(p.price)}</div>
        </div>
      </Link>
    </motion.article>
  );
}
