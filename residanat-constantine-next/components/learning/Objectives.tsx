export function Objectives({ items }: { items: string[] }) {
  return (
    <div className="card">
      <h3 className="font-semibold mb-2">Objectifs d'apprentissage</h3>
      <ol className="list-decimal ml-6">
        {items.map((it, i) => <li key={i} className="mb-1">{it}</li>)}
      </ol>
    </div>
  );
}
