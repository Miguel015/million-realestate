"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { PropertyDto } from "@/app/lib/api";

function highlight(text: string, needle: string) {
  if (!needle) return text;
  const parts = text.split(new RegExp(`(${needle})`, "ig"));
  return parts.map((p, i) =>
    p.toLowerCase() === needle.toLowerCase()
      ? <mark key={i} className="rounded bg-yellow-300/30 px-1">{p}</mark>
      : <span key={i}>{p}</span>
  );
}

function isValidObjectId(id?: string) {
  return !!id && /^[0-9a-fA-F]{24}$/.test(id);
}

export default function PropertyCard({
  p, qName, qAddress,
}: { p: PropertyDto; qName?: string; qAddress?: string }) {

  const href = isValidObjectId(p.id) ? `/property/${p.id}` : undefined;

  const CardInner = (
    <>
      <div className="relative aspect-[4/3]">
        <Image
          src={p.image}
          alt={p.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
          New
        </span>
      </div>
      <div className="space-y-1 p-3">
        <h3 className="line-clamp-2 text-base font-semibold">
          {highlight(p.name, qName ?? "")}
        </h3>
        <p className="line-clamp-1 text-sm text-zinc-400">
          {highlight(p.addressProperty, qAddress ?? "")}
        </p>
        <p className="text-sm font-bold">${new Intl.NumberFormat("en-US").format(p.priceProperty)}</p>
      </div>
    </>
  );

  return (
    <motion.div
      layout
      variants={{ hidden: { opacity: 0, y: 8, scale: .98 }, show: { opacity: 1, y: 0, scale: 1 } }}
      initial="hidden"
      animate="show"
      exit="hidden"
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {href ? (
        <Link
          href={href}
          className="group block overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
        >
          {CardInner}
        </Link>
      ) : (
        <div
          className="group block cursor-not-allowed overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 opacity-80"
          title="No detail available"
        >
          {CardInner}
        </div>
      )}
    </motion.div>
  );
}
