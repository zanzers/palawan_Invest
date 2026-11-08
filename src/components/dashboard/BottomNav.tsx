"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ITEMS } from "@/type/NavType";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard" style={{ position: "fixed", left: "50%", transform: "translateX(-50%)",  bottom: "max(12px, env(safe-area-inset-bottom))", zIndex: 50,}} className="mx-auto max-w-xs rounded-3xl border border-white/40 bg-white/70 p-1.5 shadow-lg shadow-black/10 backdrop-blur-xl">
      <ul className="flex items-center justify-around gap-1">
        
        {ITEMS.map(({ href, label, Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);

          return (
            <li key={href}>
              <Link href={href} aria-label={label} aria-current={active ? "page" : undefined} className={`flex items-center justify-center rounded-full py-2.5 transition-all duration-300 motion-reduce:transition-none 
                    ${active ? "bg-[#1C2216] px-3 text-white" : "px-4 text-slate-600 hover:bg-black/5"}`}>

                <Icon size={22} weight={active ? "fill" : "regular"} aria-hidden="true" />

                <span className={`overflow-hidden whitespace-nowrap text-xs font-semibold transition-all duration-300 motion-reduce:transition-none 
                    ${active ? "ml-2 max-w-20 opacity-100" : "ml-0 max-w-0 opacity-0"}`}>
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}