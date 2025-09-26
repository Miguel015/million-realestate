/**
 * ----------------------------------------------------------------------------
 * Autor: Miguel Andrés Suárez
 * Fecha: 2025-09-25
 * Archivo: src/app/property/[id]/page.tsx
 * Proyecto: Million Real Estate - Frontend
 * ----------------------------------------------------------------------------
 * Descripción:
 * Página de detalle de propiedad.
 * - Carga detalle por id (con validación de ObjectId).
 * - Navegación por thumbnails (prev/next).
 * - Placeholders si no hay imágenes.
 * ----------------------------------------------------------------------------
 */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchPropertyById as fetchProperty,
  fetchProperties,
  type PropertyDto,
  type PropertyDetailDto,
} from "@/app/lib/api";

// --------- helpers ----------
const isOid = (id?: string) => !!id && /^[0-9a-fA-F]{24}$/.test(id ?? "");
const money = (v: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(v);
const placeholder = "https://picsum.photos/seed/placeholder/1200/900";

// --------- page ----------
export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<PropertyDetailDto | null>(null);
  const [items, setItems] = useState<Array<{ id: string; name: string; image: string }>>([]);
  const [dir, setDir] = useState<1 | -1>(1);
  const [err, setErr] = useState<null | "NOT_FOUND" | "GENERIC">(null);

  const load = useCallback(
    async (oid: string) => {
      setLoading(true);
      try {
        // detalle
        const detail = await fetchProperty(oid);
        setItem(detail);
        setErr(null);

        // índice para prev/next + thumbnails
        const list = await fetchProperties({ page: 1, pageSize: 50 });
        const mapped = (list.data as PropertyDto[])
          .map((p) => ({
            id: p.id,
            name: p.name,
            image: p.image || placeholder,
          }))
          .filter((x) => isOid(x.id));
        setItems(mapped);
      } catch (e: any) {
        if (e?.message === "NOT_FOUND") {
          setErr("NOT_FOUND");
          setItem(null);
        } else {
          setErr("GENERIC");
          setItem(null);
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (isOid(id)) load(id);
  }, [id, load]);

  // vecinos
  const idx = useMemo(() => items.findIndex((x) => x.id === id), [items, id]);
  const prevId = idx > 0 ? items[idx - 1]?.id : undefined;
  const nextId = idx >= 0 && idx < items.length - 1 ? items[idx + 1]?.id : undefined;

  const goPrev = () => {
    if (!prevId) return;
    setDir(-1);
    router.push(`/property/${prevId}`);
  };
  const goNext = () => {
    if (!nextId) return;
    setDir(1);
    router.push(`/property/${nextId}`);
  };

  // teclas ← →
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prevId, nextId]);

  // imagen principal
  const hero = item?.images?.[0] || placeholder;

  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-6">
      {/* Back */}
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-4 py-2 text-sm text-zinc-200 transition hover:-translate-x-0.5 hover:border-zinc-700 hover:bg-zinc-900"
        >
          <svg className="h-4 w-4 transition group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        <span className="hidden text-xs text-zinc-500 sm:block">Use ← → to navigate</span>
      </div>

      {/* mensajes de error */}
      {err === "NOT_FOUND" && (
        <div className="mb-4 rounded-lg border border-zinc-800 bg-zinc-900/70 p-4 text-center text-zinc-300">
          No encontrado
        </div>
      )}
      {err === "GENERIC" && (
        <div className="mb-4 rounded-lg border border-red-800/50 bg-red-900/20 p-4 text-center text-red-300">
          Ocurrió un error al cargar la propiedad
        </div>
      )}

      <div className="relative">
        {/* flechas */}
        <ArrowButton side="left" onClick={goPrev} disabled={!prevId} />
        <ArrowButton side="right" onClick={goNext} disabled={!nextId} />

        {/* card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-3 sm:p-4">
          <AnimatePresence mode="wait" initial={false} custom={dir}>
            {loading || !item ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-[460px] animate-pulse rounded-xl bg-zinc-800/60"
              />
            ) : (
              <motion.section
                key={item.id}
                custom={dir}
                initial={{ opacity: 0, x: dir === 1 ? 30 : -30, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: dir === 1 ? -30 : 30, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 240, damping: 22 }}
                className="grid gap-6 md:grid-cols-2"
              >
                {/* imagen */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <Image
                    src={hero}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                </div>

                {/* texto */}
                <div className="flex flex-col justify-center gap-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-400">
                    Property
                  </p>
                  <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
                    {item.name}
                  </h1>
                  <p className="text-zinc-300">{item.address}</p>

                  <div className="mt-1 flex flex-wrap items-center gap-3">
                    <Badge tone="success">${money(item.price)}</Badge>
                    <Badge>Owner: {item.owner?.name || item.idOwner}</Badge>
                    <Badge>ID: {item.id}</Badge>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow transition hover:-translate-y-0.5 hover:shadow-lg">
                      Contact
                    </button>
                    <button className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm text-zinc-200 transition hover:-translate-y-0.5 hover:border-zinc-600">
                      Schedule visit
                    </button>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* thumbnails */}
      {items.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-2 text-sm font-medium text-zinc-400">More properties</h3>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {items.slice(0, 12).map((it) => {
              const active = it.id === id;
              return (
                <button
                  key={it.id}
                  onClick={() => {
                    setDir(1);
                    router.push(`/property/${it.id}`);
                  }}
                  className={`group relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border transition ${
                    active
                      ? "border-emerald-500/70 ring-2 ring-emerald-500/30"
                      : "border-zinc-800 hover:border-zinc-700"
                  }`}
                  title={it.name}
                >
                  <Image
                    src={it.image || placeholder}
                    alt={it.name}
                    fill
                    sizes="112px"
                    className="object-cover transition group-hover:scale-105"
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}

// --------- UI pequeñito ----------
function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone?: "success";
}) {
  if (tone === "success") {
    return (
      <span className="rounded-full border border-emerald-700/60 bg-emerald-600/20 px-3 py-1 text-sm font-semibold text-emerald-300">
        {children}
      </span>
    );
  }
  return (
    <span className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
      {children}
    </span>
  );
}

function ArrowButton({
  side,
  disabled,
  onClick,
}: {
  side: "left" | "right";
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`absolute top-1/2 z-10 -translate-y-1/2 rounded-full border border-zinc-800 bg-zinc-900/70 p-2 text-zinc-200 shadow transition hover:scale-105 hover:border-zinc-700 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-40 ${
        side === "left" ? "left-2" : "right-2"
      }`}
      aria-label={side === "left" ? "Previous" : "Next"}
    >
      {side === "left" ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      )}
    </button>
  );
}
