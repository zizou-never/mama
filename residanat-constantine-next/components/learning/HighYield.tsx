export function HighYield({ items }: { items: string[] }) {
  return (
    <div className="card">
      <h3 className="font-semibold mb-2">High-Yield</h3>
      <ul className="list-disc ml-6">
        {items.map((it, i) => <li key={i} className="mb-1">{it}</li>)}
      </ul>
    </div>
  );
}
