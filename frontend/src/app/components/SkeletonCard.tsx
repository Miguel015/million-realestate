export default function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
      <div className="h-40 w-full animate-pulse bg-zinc-800/60" />
      <div className="space-y-2 p-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-800/60" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-800/60" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-zinc-800/60" />
      </div>
    </div>
  );
}
