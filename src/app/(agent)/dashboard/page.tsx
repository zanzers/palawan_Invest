import { Suspense } from "react";
import DashboardHeader from "./DashboardHeader";
import SearchBar from "@/components/dashboard/SearchBar";
import { LOCATIONS, PROPERTY_TYPES } from "@/app/config/filterOptions";

export default function DashboardHome() {
  return (
    <>
       <div className="pt-8">
        <DashboardHeader  unreadMessages={0} unreadNotifications={0}/>
       </div>

        <main className="mx-auto max-w-3xl px-4 pt-4">
          <Suspense fallback={<div className="h-12" />}>
            <SearchBar locations={LOCATIONS} types={PROPERTY_TYPES} />
          </Suspense>
        </main>
    
    </>
   
 
  );
}

