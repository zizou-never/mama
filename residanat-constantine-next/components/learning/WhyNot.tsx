export function WhyNot({ items }: { items: { choice: string; reason: string }[] }) {
  return (
    <div className="card">
      <h4 className="font-semibold mb-2">Pourquoi pas les autres réponses ?</h4>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i}><span className="font-semibold">{it.choice}:</span> {it.reason}</li>
        ))}
      </ul>
    </div>
  );
}
