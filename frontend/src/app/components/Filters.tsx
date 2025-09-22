"use client";

import { motion, AnimatePresence } from "framer-motion";
import PriceRange from "./PriceRange";
import { fmtMoney } from "@/app/lib/format";

type Props = {
  name: string; setName: (v: string) => void;
  address: string; setAddress: (v: string) => void;
  minPrice: string; setMinPrice: (v: string) => void;
  maxPrice: string; setMaxPrice: (v: string) => void;
  onSearch: () => void; onClear: () => void; busy?: boolean;
};

export default function Filters({
  name, setName, address, setAddress, minPrice, setMinPrice, maxPrice, setMaxPrice,
  onSearch, onClear, busy
}: Props) {
  const minNum = Number(minPrice || 0);
  const maxNum = Number(maxPrice || 1000000);

  const chips = [
    name && { label: `Name: ${name}`, clear: () => setName("") },
    address && { label: `Address: ${address}`, clear: () => setAddress("") },
    (minPrice || maxPrice) && {
      label: `Price: $${fmtMoney(minNum || 0)} — $${fmtMoney(maxNum || 1_000_000)}`,
      clear: () => { setMinPrice(""); setMaxPrice(""); },
    },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  return (
    <AnimatePresence mode="popLayout">
      <motion.section
        key="filters"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
        className="mb-4 space-y-2"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <input
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-600"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
          <input
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-600"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />

          <div className="flex items-center gap-2">
            <button
              onClick={onSearch}
              disabled={busy}
              className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-black transition hover:brightness-95 active:scale-[.98] disabled:opacity-50"
            >
              {busy ? "Searching…" : "Search"}
            </button>
            <button
              onClick={onClear}
              disabled={busy}
              className="rounded-lg border border-zinc-700 px-3 py-2 text-sm transition hover:bg-zinc-800/40 active:scale-[.98] disabled:opacity-50"
            >
              Clear
            </button>
          </div>

          <div className="md:col-span-2 lg:col-span-2">
            <PriceRange
              min={0}
              max={1000000}
              step={1000}
              valueMin={minNum || 0}
              valueMax={maxNum || 1000000}
              onChange={(lo, hi) => { setMinPrice(String(lo)); setMaxPrice(String(hi)); }}
            />
          </div>
        </div>

        {chips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2"
          >
            {chips.map((c, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={c.clear}
                className="rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
                title="Remove filter"
              >
                {c.label} ✕
              </motion.button>
            ))}
          </motion.div>
        )}
      </motion.section>
    </AnimatePresence>
  );
}
