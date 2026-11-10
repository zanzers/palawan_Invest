export default function ListingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <ul className="-mx-4 mt-8 flex gap-4 overflow-hidden px-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          className="w-[78%] max-w-[18rem] shrink-0 animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white"
        >
          <div className="aspect-16/10 bg-slate-200" />
          <div className="space-y-2 p-4">
            <div className="h-4 w-2/3 rounded bg-slate-200" />
            <div className="h-3 w-1/3 rounded bg-slate-200" />
          </div>
        </li>
      ))}
    </ul>
  );
}