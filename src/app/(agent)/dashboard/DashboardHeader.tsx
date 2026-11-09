"use client";

import Link from "next/link";
import { Props } from "@/type/DashboardType";
import { BellIcon, EnvelopeSimpleIcon } from "@phosphor-icons/react";
import PalInvestIcons from "../../../../public/icons/PalInvestIcons";
import { IconLink } from "@/components/dashboard/DashboardFunctions";


export default function DashboardHeader({ unreadMessages = 0, unreadNotifications = 0 }: Props) {
  return (
    <header className="sticky top-4 z-40  backdrop-blur-xl" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
 

        <Link href="/dashboard" aria-label="Palawan Home, dashboard" className="flex items-center gap-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-full ">
            <PalInvestIcons />
          </span>

          <div className="flex flex-col justify-center leading-none">
            <span className="text-sm font-black uppercase tracking-widest text-[#1C2216]">
                PalHome
            </span>
            <span className="text-[8px] font-semibold uppercase tracking-wider text-gray-500 mt-0.5">
                Real Estate
            </span>
          </div>
         
        </Link>


        <nav aria-label="Quick actions" className="flex items-center gap-3">
          <IconLink href="/dashboard/inbox" label="Messages" count={unreadMessages}>
            <EnvelopeSimpleIcon size={24} />
          </IconLink>
          <IconLink href="/dashboard/notifications" label="Notifications" count={unreadNotifications}>
            <BellIcon size={24} />
          </IconLink>
        </nav>
      </div>
    </header>
  );
}

