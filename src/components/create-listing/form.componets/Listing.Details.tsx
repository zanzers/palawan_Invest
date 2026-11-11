export default function Stub({ title, hint, fields }: { title: string; hint: string; fields: string[] }) {
  return (
    <div>
      <h2 className="text-lg font-extrabold tracking-tight text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{hint}</p>
      <ul className="mt-4 space-y-2 rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
        {fields.map((f) => (
          <li key={f}>• {f}</li>
        ))}
      </ul>
    </div>
  );
}
