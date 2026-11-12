import AddListingWizard from "@/components/create-listing/addListingWizard";


export default function AddListingPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 pt-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Add listing</h1>
      <p className="mt-1 text-sm text-slate-500">A few quick steps. Nothing is published until you confirm.</p>
      <div className="mt-6">
        <AddListingWizard />
      </div>
    </main>
  );
}