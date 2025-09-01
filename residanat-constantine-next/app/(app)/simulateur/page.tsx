"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { mockQcms } from "@/lib/mockData";

export default function Simulateur() {
  const sp = useSearchParams();
  const cat = sp.get("cat");
  const n = Number(sp.get("n") || "20");
  const [i, setI] = useState(0);
  const [ans, setAns] = useState<number[]>(Array(mockQcms.length).fill(-1));
  const [done, setDone] = useState(false);

  // Filtrer les QCM selon la catégorie et le nombre demandé
  const qs = mockQcms.filter(q => !cat || q.category_id === cat).slice(0, n);
  const progress = useMemo(() => qs.length ? Math.round((i / qs.length) * 100) : 0, [i, qs]);

  if (!cat) return <main className="container page">Sélectionnez une catégorie depuis la page QCM.</main>;
  if (!qs.length) return <main className="container page">Chargement des questions...</main>;
  if (done) {
    const good = qs.reduce((acc, q, idx)=> acc + (ans[idx] === q.answer_index ? 1 : 0), 0);
    const score = Math.round((good / qs.length) * 100);
    return (
      <main className="container page">
        <div className="card">
          <h2 className="text-2xl font-bold mb-2">Résultat</h2>
          <p>Score: <b>{score}%</b> • Bonnes réponses: {good}/{qs.length}</p>
          <details className="mt-3">
            <summary>Voir corrections</summary>
            <ol className="list-decimal ml-6 mt-2 space-y-2">
              {qs.map((q, idx)=>(
                <li key={q.id}>
                  <div className="font-medium">{q.question}</div>
                  <div>Votre réponse: <b>{ans[idx] >= 0 ? q.options[ans[idx]] : "—"}</b> • Bonne: <b>{q.options[q.answer_index]}</b></div>
                  {q.explanation && <div className="muted text-sm">{q.explanation}</div>}
                </li>
              ))}
            </ol>
          </details>
        </div>
      </main>
    );
  }

  const q = qs[i];

  return (
    <main className="container page">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-semibold">Question {i+1} / {qs.length}</h1>
        <div className="w-56 h-2 bg-white/10 rounded overflow-hidden"><div className="h-full bg-gradient-to-r from-primary to-violet-600" style={{width: `${progress}%`}} /></div>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-2">{q.question}</h3>
        <div className="grid gap-2">
          {q.options.map((o: string, idx: number)=>(
            <label key={idx} className="flex gap-2 items-center bg-white/5 border border-white/10 rounded p-2 cursor-pointer">
              <input type="radio" name="ans" checked={ans[i]===idx} onChange={()=>{ const cp=[...ans]; cp[i]=idx; setAns(cp); }} />
              <span>{o}</span>
            </label>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <button className="btn btn-soft" disabled={i===0} onClick={()=>setI(i-1)}>Précédent</button>
          <button className="btn" onClick={()=> i < qs.length-1 ? setI(i+1) : setDone(true)}>{i < qs.length-1 ? "Suivant" : "Terminer"}</button>
        </div>
      </div>
    </main>
  );
}
