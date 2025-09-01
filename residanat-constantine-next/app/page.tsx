import Link from "next/link";

export default function Page() {
  return (
    <main>
      <section className="py-16 bg-[radial-gradient(900px_400px_at_10%_-10%,rgba(59,130,246,0.25),transparent),radial-gradient(900px_400px_at_90%_0%,rgba(124,58,237,0.25),transparent)]">
        <div className="container grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-3">Prépare ton résidanat avec exigence</h1>
            <p className="muted mb-4">Formations ciblées, QCM type examen, simulateur, IA tuteur et révision espacée SM‑2.</p>
            <div className="flex gap-3">
              <Link className="btn" href="/formations">Voir les formations</Link>
              <Link className="btn btn-soft" href="/qcm">Commencer les QCM</Link>
            </div>
            <div className="mt-4 flex gap-2">
              <span className="badge">+92% réussite</span>
              <span className="badge">+1200 QCM</span>
              <span className="badge">+200h cours</span>
            </div>
          </div>
          <div className="card">
            <h3 className="font-semibold">Statistiques</h3>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="card"><div className="text-2xl font-bold">—</div><div className="muted">Étudiants</div></div>
              <div className="card"><div className="text-2xl font-bold">—</div><div className="muted">Formations</div></div>
              <div className="card"><div className="text-2xl font-bold">—</div><div className="muted">QCM</div></div>
              <div className="card"><div className="text-2xl font-bold">—</div><div className="muted">Inscriptions</div></div>
            </div>
            <p className="muted mt-3 text-sm">Données non contractuelles. Usage pédagogique.</p>
          </div>
        </div>
      </section>

      <section className="container page">
        <h2 className="section-title">Méthodologie (inspirée AMBOSS)</h2>
        <div className="grid-3">
          <div className="card">
            <h3 className="font-semibold mb-2">High-Yield</h3>
            <p className="muted">Focus points, algorithmes cliniques, pièges d’examen.</p>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">Active recall</h3>
            <p className="muted">QCM, mini-cas, explications “Why not?”.</p>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">Spaced repetition</h3>
            <p className="muted">Cartes SM‑2 personnalisées, suivis de performance.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
