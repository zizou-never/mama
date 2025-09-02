"use client";
import { useState, useEffect } from "react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import LinkTiptap from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Link from "next/link";

export default function Formations() {
  const [courses, setCourses] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      const supabase = supabaseBrowser();
      const { data, error } = await supabase.from('courses').select('*');
      if (!error && data) setCourses(data);
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = q ? course.title?.toLowerCase().includes(q.toLowerCase()) : true;
    const matchesCategory = cat ? course.category === cat : true;
    return matchesSearch && matchesCategory;
  });

  // إعداد محرر Tiptap
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      LinkTiptap,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: '<h2>محرر الدروس (OneNote Style)</h2><p>يمكنك كتابة وتنسيق الدروس هنا، وإضافة صور وجداول وروابط...</p>',
    immediatelyRender: false,
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
      <div className="grid-3 mb-8">
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

      {/* محرر الدروس المتقدم */}
      <section className="bg-white/10 rounded p-4 border border-white/20 mb-8">
        <h2 className="text-xl font-bold mb-2">محرر الدروس (OneNote Style)</h2>
        <div className="prose max-w-none bg-white rounded p-2">
          <EditorContent editor={editor} />
        </div>
      </section>
    </main>
  );
}
