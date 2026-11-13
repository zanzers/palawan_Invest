"use client";

import Link from "next/link";
import AddListingForm from "./AddListingForm";
import { ArrowLeftIcon } from "@phosphor-icons/react";


export default function AddListingPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 pt-8">

      <div className="flex items-center gap-2">
        <Link href="/dashboard" aria-label="Back to dashboard" className="flex h-9 w-9 items-center justify-center rounded-full text-slate-900 hover:bg-slate-100">
          <ArrowLeftIcon size={20} />
        </Link>
      </div>

      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Property information</h1>
      <p className="mt-1 text-sm text-slate-500">A few quick steps. Nothing is published until you confirm.</p>
      <div className="mt-6">
        <AddListingForm />
      </div>
    </main>
  );
}