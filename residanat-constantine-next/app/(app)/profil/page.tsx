"use client";

import { useState } from "react";
import { mockCourses } from "@/lib/mockData";

export default function Profil() {
  // Utilisateur fictif
  const [user] = useState<any>({ email: "test@example.com" });
  // Toutes les formations mockées comme "inscrites"
  const [myCourses] = useState<any[]>(mockCourses);

  return (
    <main className="container page">
      <div className="grid-2">
        <div className="card">
          <h2 className="text-xl font-semibold mb-2">Mon profil</h2>
          <p><b>Email:</b> {user.email}</p>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-2">Mes formations</h2>
          {myCourses.length ? myCourses.map(c => <div key={c.id} className="mb-2"><b>{c.title}</b><div className="muted text-sm">{c.description}</div></div>) : <p className="muted">Aucune inscription.</p>}
        </div>
      </div>
    </main>
  );
}
