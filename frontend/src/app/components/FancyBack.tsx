"use client";

import { useRouter } from "next/navigation";
import { motion, useAnimation } from "framer-motion";
import { useState } from "react";

export default function FancyBack({ label = "Back" }: { label?: string }) {
  const router = useRouter();
  const controls = useAnimation();
  const [pressing, setPressing] = useState(false);

  async function handleClick() {
    setPressing(true);
    // pequeña animación de “pulse” antes de volver
    await controls.start({ scale: 0.97, boxShadow: "0 0 0 12px rgba(255,255,255,0.08)" });
    await controls.start({ scale: 1, boxShadow: "0 0 0 0 rgba(255,255,255,0.0)" });
    router.back();
  }

  return (
    <motion.button
      onMouseDown={() => setPressing(true)}
      onMouseUp={() => setPressing(false)}
      onClick={handleClick}
      animate={controls}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-sm text-zinc-200 backdrop-blur transition"
    >
      {/* glow al hover */}
      <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-white/10 to-transparent opacity-0 blur transition-opacity duration-300 group-hover:opacity-100" />
      {/* icono */}
      <svg className="h-4 w-4 -translate-x-0.5 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none">
        <path d="M10 7L5 12L10 17" stroke="currentColor" strokeWidth="1.8" />
        <path d="M5 12H19" stroke="currentColor" strokeWidth="1.8" />
      </svg>
      <span className="relative z-10">{label}</span>
      {/* ripple sutil */}
      {pressing && (
        <span className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-white/10" />
      )}
    </motion.button>
  );
}
