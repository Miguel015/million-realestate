"use client";

import { useEffect, useMemo, useState } from "react";
import { fmtMoney } from "@/app/lib/format";

type Props = {
  min?: number;
  max?: number;
  step?: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
};

export default function PriceRange({
  min = 0, max = 1000000, step = 1000, valueMin, valueMax, onChange,
}: Props) {
  const [a, setA] = useState(valueMin);
  const [b, setB] = useState(valueMax);

  useEffect(() => { setA(valueMin); }, [valueMin]);
  useEffect(() => { setB(valueMax); }, [valueMax]);

  const lo = Math.min(a, b);
  const hi = Math.max(a, b);

  const [left, right] = useMemo(() => {
    const span = max - min || 1;
    const l = ((lo - min) / span) * 100;
    const r = 100 - ((hi - min) / span) * 100;
    return [l, r];
  }, [lo, hi, min, max]);

  return (
    <div className="relative flex w-full select-none items-center rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2">
      <div className="relative my-2 h-2 w-full">
        <div className="absolute inset-0 rounded-full bg-zinc-800" />
        <div
          className="absolute h-2 rounded-full bg-white transition-[left,right] duration-200"
          style={{ left: `${left}%`, right: `${right}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={a}
          onChange={(e) => setA(Number(e.target.value))}
          onMouseUp={() => onChange(Math.min(a, b), Math.max(a, b))}
          onTouchEnd={() => onChange(Math.min(a, b), Math.max(a, b))}
          className="range-thumb absolute inset-0 h-2 w-full appearance-none bg-transparent"
          aria-label="Min price"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={b}
          onChange={(e) => setB(Number(e.target.value))}
          onMouseUp={() => onChange(Math.min(a, b), Math.max(a, b))}
          onTouchEnd={() => onChange(Math.min(a, b), Math.max(a, b))}
          className="range-thumb absolute inset-0 h-2 w-full appearance-none bg-transparent"
          aria-label="Max price"
        />
      </div>

      <div className="ml-3 hidden min-w-[160px] text-right text-xs text-zinc-400 sm:block">
        <div>From <span className="font-semibold text-white">${fmtMoney(lo)}</span></div>
        <div>to <span className="font-semibold text-white">${fmtMoney(hi)}</span></div>
      </div>

      <style jsx>{`
        .range-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 18px;
          width: 18px;
          background: white;
          border-radius: 9999px;
          border: 2px solid #18181b;
          cursor: pointer;
          margin-top: -8px;
        }
        .range-thumb::-moz-range-thumb {
          height: 18px;
          width: 18px;
          background: white;
          border-radius: 9999px;
          border: 2px solid #18181b;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
