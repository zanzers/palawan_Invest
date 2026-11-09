"use client";


import { SearchProps } from "@/type/DashboardPropsType";
import FilterForm from "./FilterFunctions";
import { Filters } from "@/type/filterType";



export default function FilterSheet({ dialogRef, formKey, locations, types, value, onApply }: SearchProps) {
  const close = () => dialogRef.current?.close();

  return (
    <dialog ref={dialogRef} onClick={(e) => {
        if (e.target === e.currentTarget) close(); 
      }} className="m-0 mb-0 mt-auto w-full max-w-none rounded-t-3xl bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm open:animate-sheet-up motion-reduce:animate-none md:m-auto md:max-w-md md:rounded-3xl md:animate-none">
      
      <FilterForm key={formKey} locations={locations} types={types} value={value}
        onApply={(f: Filters) => {
          onApply(f);
          close();
        }}
        onClose={close}
      />
    </dialog>
  );
}


