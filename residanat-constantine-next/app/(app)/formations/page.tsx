"use client";
import { useState } from "react";
import Link from "next/link";
import { mockCourses } from "@/lib/mockData";

export default function Formations() {
  const [courses] = useState(mockCourses);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");

  const filteredCourses = courses.filter(course => {
    const matchesSearch = q ? course.title.toLowerCase().includes(q.toLowerCase()) : true;
    const matchesCategory = cat ? course.category === cat : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="container page">
      <h1 className="text-3xl font-bold mb-4">Formations</h1>
      <div className="flex gap-2 mb-4">
        <input className="border rounded px-3 py-2 w-full bg-white/10" placeholder="Rechercher..." value={q} onChange={e => setQ(e.target.value)} />
        <select className="border rounded px-3 py-2 bg-white/10" value={cat} onChange={e => setCat(e.target.value)}>
          <option value="">Toutes</option>
          <option value="medecine">Médecine</option>
          <option value="chirurgie">Chirurgie</option>
          <option value="pediatrie">Pédiatrie</option>
        </select>
      </div>
      <div className="grid-3">
        {filteredCourses.map((c) => (
          <div key={c.id} className="card">
            {c.image && <img src={c.image} alt="" className="rounded mb-2 border border-white/10 h-40 w-full object-cover" />}
            <h3 className="font-semibold">{c.title}</h3>
            <p className="muted text-sm mb-2">{c.description}</p>
            <div className="flex items-center justify-between">
              <span className="badge">{c.hours} h</span>
              <Link className="btn btn-soft" href={`/simulateur?course=${c.id}`}>S'entraîner</Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
