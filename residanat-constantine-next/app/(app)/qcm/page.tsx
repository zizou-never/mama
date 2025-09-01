"use client";

import { useState } from "react";
import Link from "next/link";
import { mockQcmCategories } from "@/lib/mockData";

export default function QCM() {
  const [cats] = useState(mockQcmCategories);
  return (
    <main className="container page">
      <h1 className="text-3xl font-bold mb-4">Banque de QCM</h1>
      <div className="grid-3">
        {cats.map((c)=>(
          <div key={c.id} className="card">
            <h3 className="font-semibold">{c.name}</h3>
            <p className="muted text-sm">Entraînement ciblé</p>
            <div className="mt-3 flex gap-2">
              <Link className="btn btn-soft" href={`/simulateur?cat=${c.id}&n=20`}>Quiz 20</Link>
              <Link className="btn" href={`/simulateur?cat=${c.id}&n=60`}>Session 60</Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
