"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fetchProperties, PropertiesResponse, PropertyDto } from "@/app/lib/api";
import Filters from "./components/Filters";
import PropertyCard from "./components/PropertyCard";
import SkeletonCard from "./components/SkeletonCard";
import { useDebounce } from "./hooks/useDebounce";

export default function Home() {
  // filtros
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // paginación
  const [page, setPage] = useState(1);

  // debounce para evitar spam a la API
  const dName = useDebounce(name);
  const dAddress = useDebounce(address);
  const dMin = useDebounce(minPrice);
  const dMax = useDebounce(maxPrice);

  // data
  const [data, setData] = useState<PropertiesResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function load(p = 1) {
    setLoading(true);
    try {
      const res = await fetchProperties({
        name: dName || undefined,
        address: dAddress || undefined,
        minPrice: dMin || undefined,
        maxPrice: dMax || undefined,
        page: p,
        pageSize: 12,
      });
      setData(res);
      setPage(p);
    } finally {
      setLoading(false);
    }
  }

  // búsqueda automática con debounce
  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dName, dAddress, dMin, dMax]);

  // scroll suave al cambiar de página
  function goto(p: number) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    load(p);
  }

  return (
    <main className="mx-auto max-w-7xl p-6">
      <h1 className="mb-4 text-3xl font-bold">Properties</h1>

      <Filters
        name={name} setName={setName}
        address={address} setAddress={setAddress}
        minPrice={minPrice} setMinPrice={setMinPrice}
        maxPrice={maxPrice} setMaxPrice={setMaxPrice}
        onSearch={() => load(1)}
        onClear={() => { setName(""); setAddress(""); setMinPrice(""); setMaxPrice(""); load(1); }}
        busy={loading}
      />

      {/* loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* resultados / estado vacío */}
      {!loading && data && (
        <>
          {data.data.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-zinc-800 p-6 text-zinc-400"
            >
              No properties found.
              <button
                onClick={() => { setName(""); setAddress(""); setMinPrice(""); setMaxPrice(""); load(1); }}
                className="ml-2 underline"
              >
                Clear filters
              </button>
            </motion.div>
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={`grid-${page}-${dName}-${dAddress}-${dMin}-${dMax}`}
                  layout
                  variants={{ show: { transition: { staggerChildren: 0.04 } } }}
                  initial="show"
                  animate="show"
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                >
                  {data.data.map((p: PropertyDto) => (
                    <PropertyCard key={p.id} p={p} qName={dName} qAddress={dAddress} />
                  ))}
                </motion.div>
              </AnimatePresence>

              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => goto(Math.max(1, page - 1))}
                  disabled={page <= 1}
                  className="rounded-lg border border-zinc-700 px-3 py-2 text-sm disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-sm">
                  Page {page}{data.pagination?.totalPages ? ` of ${data.pagination.totalPages}` : ""}
                </span>
                <button
                  onClick={() => goto(page + 1)}
                  className="rounded-lg border border-zinc-700 px-3 py-2 text-sm"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
}
