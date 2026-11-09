import Link from "next/link";

export function IconLink({ href, label, count, children,}: { href: string; label: string; count: number; children: React.ReactNode;}) {
  return (
    <Link href={href} aria-label={count > 0 ? `${label}, ${count} unread` : label}
      className="relative flex h-10 w-10 items-center justify-center bg-black/5 rounded-full text-slate-700 transition hover:bg-black/5 active:scale-95"
    >
      {children}
      {count > 0 && (
        <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}