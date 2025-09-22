"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useQueryState() {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();

  const setMany = useCallback((updates: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(search.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v === undefined || v === "") params.delete(k);
      else params.set(k, String(v));
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, [router, pathname, search]);

  return { search, setMany };
}
