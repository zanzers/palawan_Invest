


export default function PagePlaceholder({ title, note}: { title: string, note: string}) {
  return (
    <main className="mx-auto max-w-3xl px-4 pt-10">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            {title}
        </h1>

        <p className="mt-2 text-sm text-slate-500">
            {note}
        </p>
    </main>
    
  );
}

