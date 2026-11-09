export default function ListingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <ul className="mt-8 grid gap-4 md:grid-cols-2" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="aspect-[16/10] bg-slate-200" />
          <div className="space-y-2 p-4">
            <div className="h-4 w-2/3 rounded bg-slate-200" />
            <div className="h-3 w-1/3 rounded bg-slate-200" />
          </div>
        </li>
      ))}
    </ul>
  );
}