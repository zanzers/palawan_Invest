"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import type { Filters } from "@/type/filterType";



// SEARCH FILTERS
export function useSearchFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [q, setQ] = useState(params.get("q") ?? "");
  const [openId, setOpenId] = useState(0);
  const sheetRef = useRef<HTMLDialogElement>(null);

  const filters: Filters = {
    location: params.get("location") ?? "",
    type: params.get("type") ?? "",
    maxPrice: params.get("max_price") ?? "",
  };

  const activeCount = [filters.location, filters.type, filters.maxPrice].filter(Boolean).length;

 function pushSearch(next: { q?: string } & Partial<Filters>) {
    const sp = new URLSearchParams(params.toString());
    const set = (key: string, value: string | undefined) => {
      if (value === undefined) return;
      if (value) sp.set(key, value);
      else sp.delete(key);
    };
    set("q", next.q);
    set("location", next.location);
    set("type", next.type);
    set("max_price", next.maxPrice);

    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function onSubmitSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    pushSearch({ q: q.trim() });
  }

  function openSheet() {
    setOpenId((n) => n + 1);
    sheetRef.current?.showModal();
  }

  return { q, setQ, filters, activeCount, sheetRef, openId, pushSearch, onSubmitSearch, openSheet };
}


// ICONSLINK FUNCTION
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
