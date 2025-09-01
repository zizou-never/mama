#!/usr/bin/env bash
set -e

APP="residanat-constantine-next"

echo "🚀 Création du projet $APP (Next.js + Supabase + Vercel + IA)..."

 # Structure (compatibilité bash)
mkdir -p "$APP/app/(app)/formations"
mkdir -p "$APP/app/(app)/qcm"
mkdir -p "$APP/app/(app)/simulateur"
mkdir -p "$APP/app/(app)/profil"
mkdir -p "$APP/app"
mkdir -p "$APP/app/app-group"
mkdir -p "$APP/app/admin-group"
mkdir -p "$APP/app/auth-group"
mkdir -p "$APP/app/api"
mkdir -p "$APP/components"
mkdir -p "$APP/components/learning"
mkdir -p "$APP/lib"
mkdir -p "$APP/lib/supabase"
mkdir -p "$APP/public"
mkdir -p "$APP/supabase/migrations"
mkdir -p "$APP/.github/workflows"
mkdir -p "$APP/app/(admin)/dashboard"
mkdir -p "$APP/app/(auth)/login"
mkdir -p "$APP/app/(auth)/register"
mkdir -p "$APP/app/api/ai/tutor"
mkdir -p "$APP/app/api/ai/flashcards"
mkdir -p "$APP/app/api/ai/qcm"
mkdir -p "$APP/app/api/hello"
mkdir -p "$APP/styles"
mkdir -p "$APP/.vscode"

################################
# Root files
################################
cat > "$APP/.gitignore" <<'EOF'
# Node
node_modules
.next
out
dist
.DS_Store
*.log
.env
.env.*
!.env.example

# Supabase
supabase/.branches
supabase/.temp

# Vercel
.vercel
EOF

cat > "$APP/.env.example" <<'EOF'
# Next public (accessible client)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon_key_here

# Server only
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=service_role_key_here

# IA
OPENAI_API_KEY=sk-xxxx
# Optionnel: OpenRouter ou autre passerelle
AI_BASE_URL=
OPENAI_MODEL=gpt-4o-mini

# App
APP_URL=http://localhost:4000
EOF

cat > "$APP/package.json" <<'EOF'
{
  "name": "residanat-constantine-next",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "next dev -p 4000",
    "build": "next build",
    "start": "next start -p 4000",
    "lint": "next lint"
  },
  "dependencies": {
    "@ai-sdk/openai": "^0.0.28",
    "@supabase/supabase-js": "^2.45.3",
    "ai": "^3.2.36",
    "clsx": "^2.1.1",
    "lucide-react": "^0.454.0",
    "next": "^14.2.12",
    "next-themes": "^0.2.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^20.14.10",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.12",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.10",
    "typescript": "^5.5.4"
  }
}
EOF

cat > "$APP/next.config.mjs" <<'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true
  }
};
export default nextConfig;
EOF

cat > "$APP/tsconfig.json" <<'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
EOF

cat > "$APP/postcss.config.js" <<'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
EOF

cat > "$APP/tailwind.config.ts" <<'EOF'
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0f172a",
          soft: "#111827",
          light: "#f8fafc"
        },
        card: {
          dark: "#0b1220",
          light: "#ffffff"
        },
        text: {
          dark: "#e6edf3",
          light: "#0f172a",
          muted: "#6b7280"
        },
        primary: "#2563eb",
        accent: "#16a34a",
        warn: "#d97706",
        danger: "#dc2626"
      },
      boxShadow: {
        glass: "0 10px 30px rgba(0,0,0,.25)"
      }
    }
  },
  plugins: []
}
export default config;
EOF

cat > "$APP/vercel.json" <<'EOF'
{
  "version": 2,
  "functions": {
    "app/api/*/route.ts": {
      "runtime": "edge"
    }
  }
}
EOF

cat > "$APP/.github/workflows/ci.yml" <<'EOF'
name: CI
on:
  push:
    branches: [ main ]
  pull_request:
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
EOF

################################
# Devcontainer for Codespaces
################################
cat > "$APP/.devcontainer.json" <<'EOF'
{
  "name": "Résidanat Constantine",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:20",
  "postCreateCommand": "npm i -g pnpm supabase && pnpm install",
  "customizations": {
    "vscode": {
      "extensions": [
        "esbenp.prettier-vscode",
        "dbaeumer.vscode-eslint",
        "bradlc.vscode-tailwindcss",
        "supabase.vscode-supabase"
      ]
    }
  },
  "forwardPorts": [4000]
}
EOF

################################
# Styles
################################
cat > "$APP/app/globals.css" <<'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: light dark; }
html, body { height: 100%; }
body {
  @apply bg-[linear-gradient(180deg,theme(colors.bg.light),theme(colors.bg.soft))] dark:bg-[linear-gradient(180deg,theme(colors.bg.DEFAULT),theme(colors.bg.soft))] text-text-light dark:text-text-dark;
}

.container { @apply w-[min(1200px,92%)] mx-auto; }
.card { @apply bg-card-light dark:bg-card-dark border border-black/10 dark:border-white/10 rounded-xl p-5 shadow-glass; }
.btn { @apply inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-br from-primary to-violet-600 text-white hover:-translate-y-0.5 transition; }
.btn-soft { @apply bg-white/10 border border-white/20 text-white; }
.btn-outline { @apply border border-primary text-primary rounded-lg px-3 py-2; }
.badge { @apply text-sm px-2 py-1 rounded-full border border-white/20 bg-white/5; }
.muted { @apply text-text-muted; }
.grid-2 { @apply grid grid-cols-1 md:grid-cols-2 gap-4; }
.grid-3 { @apply grid grid-cols-1 md:grid-cols-3 gap-4; }
.grid-4 { @apply grid grid-cols-2 md:grid-cols-4 gap-4; }
.page { @apply py-10; }
.section-title { @apply text-2xl font-semibold mb-4; }
.navbar { @apply sticky top-0 backdrop-blur bg-black/20 border-b border-white/10 z-20; }
EOF

################################
# Lib
################################
cat > "$APP/lib/utils.ts" <<'EOF'
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
EOF

cat > "$APP/lib/supabase/client.ts" <<'EOF'
import { createClient } from "@supabase/supabase-js";

export const supabaseBrowser = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: true, autoRefreshToken: true } }
  );
EOF

cat > "$APP/lib/supabase/server.ts" <<'EOF'
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = () =>
  createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
EOF

cat > "$APP/lib/ai.ts" <<'EOF'
import { openai } from "@ai-sdk/openai";
export const aiModel = () => openai({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: process.env.AI_BASE_URL || undefined
})(process.env.OPENAI_MODEL || "gpt-4o-mini");
EOF

cat > "$APP/lib/sm2.ts" <<'EOF'
// Algorithme SM-2 pour répétition espacée
export type Grade = 0|1|2|3|4|5;
export function sm2(prevEF: number, prevInterval: number, prevReps: number, grade: Grade) {
  const q = grade;
  let ef = prevEF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (ef < 1.3) ef = 1.3;
  let reps = prevReps, interval = 0;
  if (q < 3) { reps = 0; interval = 1; }
  else {
    reps = prevReps + 1;
    if (reps === 1) interval = 1;
    else if (reps === 2) interval = 6;
    else interval = Math.round(prevInterval * ef);
  }
  return { ef, interval, reps };
}
EOF

################################
# Components (UI)
################################
cat > "$APP/components/NavBar.tsx" <<'EOF'
"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function NavBar() {
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = supabaseBrowser();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  return (
    <header className="navbar">
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className="font-bold text-lg">🎓 Résidanat Constantine</Link>
        <nav className="hidden md:flex items-center gap-4">
          <Link href="/formations" className="btn-outline">Formations</Link>
          <Link href="/qcm" className="btn-outline">QCM</Link>
          <Link href="/simulateur" className="btn-outline">Simulateur</Link>
          {user?.user_metadata?.role === "admin" && <Link href="/dashboard" className="btn-outline">Admin</Link>}
        </nav>
        <div className="flex items-center gap-2">
          <button className="btn-soft px-3 py-2 rounded" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>🌓</button>
          {user ? (
            <>
              <Link href="/profil" className="btn-soft px-3 py-2 rounded">{user.email}</Link>
              <form onSubmit={async (e)=>{e.preventDefault(); await supabaseBrowser().auth.signOut();}}>
                <button className="btn-soft px-3 py-2 rounded">Déconnexion</button>
              </form>
            </>
          ) : (
            <Link href="/login" className="btn">Connexion</Link>
          )}
        </div>
      </div>
    </header>
  );
}
EOF

cat > "$APP/components/Footer.tsx" <<'EOF'
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10">
      <div className="container py-6 flex items-center justify-between">
        <div className="font-semibold">🎓 Résidanat Constantine</div>
        <div className="muted">© 2025</div>
      </div>
    </footer>
  );
}
EOF

cat > "$APP/components/learning/HighYield.tsx" <<'EOF'
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
EOF

cat > "$APP/components/learning/Objectives.tsx" <<'EOF'
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
EOF

cat > "$APP/components/learning/WhyNot.tsx" <<'EOF'
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
EOF

################################
# App layout + Home
################################
cat > "$APP/app/layout.tsx" <<'EOF'
import "./globals.css";
import { ThemeProvider } from "next-themes";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Résidanat Constantine",
  description: "Plateforme avancée de préparation au résidanat (Constantine)"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <NavBar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
EOF

cat > "$APP/app/page.tsx" <<'EOF'
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
EOF

################################
# Pages (formations, qcm, simulateur, profil, admin)
################################
cat > "$APP/app/(app)/formations/page.tsx" <<'EOF'
"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import Link from "next/link";

export default function Formations() {
  const [courses, setCourses] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");

  useEffect(() => {
    const supabase = supabaseBrowser();
    const load = async () => {
      let query = supabase.from("courses").select("*").order("title");
      if (q) query = query.ilike("title", `%${q}%`);
      if (cat) query = query.eq("category", cat);
      const { data } = await query;
      setCourses(data || []);
    };
    load();
  }, [q, cat]);

  return (
    <main className="container page">
      <h1 className="text-3xl font-bold mb-4">Formations</h1>
      <div className="flex gap-2 mb-4">
        <input className="border rounded px-3 py-2 w-full bg-white/10" placeholder="Rechercher..." value={q} onChange={e=>setQ(e.target.value)} />
        <select className="border rounded px-3 py-2 bg-white/10" value={cat} onChange={e=>setCat(e.target.value)}>
          <option value="">Toutes</option>
          <option value="medecine">Médecine</option>
          <option value="chirurgie">Chirurgie</option>
          <option value="pediatrie">Pédiatrie</option>
        </select>
      </div>
      <div className="grid-3">
        {courses.map((c)=>(
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
EOF

cat > "$APP/app/(app)/qcm/page.tsx" <<'EOF'
"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import Link from "next/link";

export default function QCM() {
  const [cats, setCats] = useState<any[]>([]);
  useEffect(() => {
    supabaseBrowser().from("qcm_categories").select("*").order("name").then(({ data }) => setCats(data||[]));
  }, []);
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
EOF

cat > "$APP/app/(app)/simulateur/page.tsx" <<'EOF'
"use client";
import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";

export default function Simulateur() {
  const sp = useSearchParams();
  const cat = sp.get("cat");
  const n = Number(sp.get("n") || "20");
  const [qs, setQs] = useState<any[]>([]);
  const [i, setI] = useState(0);
  const [ans, setAns] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!cat) return;
      const { data } = await supabaseBrowser()
        .from("qcms")
        .select("*")
        .eq("category_id", cat)
        .limit(n);
      setQs(data||[]);
      setAns(Array((data||[]).length).fill(-1));
    };
    run();
  }, [cat, n]);

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
EOF

cat > "$APP/app/(app)/profil/page.tsx" <<'EOF'
"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function Profil() {
  const [user, setUser] = useState<any>(null);
  const [myCourses, setMyCourses] = useState<any[]>([]);

  useEffect(() => {
    (async()=>{
      const supabase = supabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) return;
      const { data } = await supabase.from("enrollments").select("courses(*)").eq("user_id", user.id);
      setMyCourses(data?.map(d=>d.courses) || []);
    })();
  }, []);

  if (!user) return <main className="container page">Connectez-vous pour voir votre profil.</main>;
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
EOF

cat > "$APP/app/(admin)/dashboard/page.tsx" <<'EOF'
"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function Dashboard() {
  const [me, setMe] = useState<any>(null);
  const [stats, setStats] = useState<any>({});
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const run = async () => {
      const supabase = supabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      setMe(user);
      const { count: students } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      const { count: qcms } = await supabase.from("qcms").select("*", { count: "exact", head: true });
      const { count: enrollments } = await supabase.from("enrollments").select("*", { count: "exact", head: true });
      const { data: courses } = await supabase.from("courses").select("*").order("title");
      setStats({ students: students||0, qcms: qcms||0, enrollments: enrollments||0, courses: courses?.length||0 });
      setCourses(courses||[]);
    };
    run();
  }, []);

  if (!me) return <main className="container page">Connexion requise.</main>;

  return (
    <main className="container page">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid-4">
        <div className="card"><h3 className="text-2xl font-bold">{stats.students}</h3><div className="muted">Étudiants</div></div>
        <div className="card"><h3 className="text-2xl font-bold">{stats.courses}</h3><div className="muted">Formations</div></div>
        <div className="card"><h3 className="text-2xl font-bold">{stats.qcms}</h3><div className="muted">QCM</div></div>
        <div className="card"><h3 className="text-2xl font-bold">{stats.enrollments}</h3><div className="muted">Inscriptions</div></div>
      </div>

      <div className="card mt-6">
        <h3 className="font-semibold mb-2">Cours</h3>
        <ul className="space-y-2">{courses.map(c => <li key={c.id} className="flex justify-between"><span>{c.title}</span><span className="muted">{c.category}</span></li>)}</ul>
      </div>
    </main>
  );
}
EOF

################################
# Auth pages
################################
cat > "$APP/app/(auth)/login/page.tsx" <<'EOF'
"use client";
import Link from "next/link";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function Login() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  return (
    <main className="container page">
      <div className="max-w-md mx-auto card">
        <h1 className="text-2xl font-semibold mb-3">Connexion</h1>
        <form onSubmit={async (e)=>{e.preventDefault(); const { error } = await supabaseBrowser().auth.signInWithPassword({ email, password }); setMsg(error?error.message:"Connecté"); if(!error) location.href="/"; }}>
          <input className="w-full mb-2 px-3 py-2 rounded border border-white/10 bg-white/10" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input type="password" className="w-full mb-2 px-3 py-2 rounded border border-white/10 bg-white/10" placeholder="Mot de passe" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="btn w-full">Se connecter</button>
        </form>
        {msg && <p className="muted mt-2">{msg}</p>}
        <p className="muted mt-3 text-sm">Pas de compte ? <Link className="underline" href="/register">Créer un compte</Link></p>
      </div>
    </main>
  );
}
EOF

cat > "$APP/app/(auth)/register/page.tsx" <<'EOF'
"use client";
import Link from "next/link";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function Register() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  return (
    <main className="container page">
      <div className="max-w-md mx-auto card">
        <h1 className="text-2xl font-semibold mb-3">Créer un compte</h1>
        <form onSubmit={async (e)=>{e.preventDefault();
          const supabase = supabaseBrowser();
          const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
          setMsg(error?error.message:"Vérifiez votre email pour confirmer.");
          if (!error && data.user) {
            await supabase.from("profiles").insert({ id: data.user.id, name });
          }
        }}>
          <input className="w-full mb-2 px-3 py-2 rounded border border-white/10 bg-white/10" placeholder="Nom complet" value={name} onChange={e=>setName(e.target.value)} />
          <input className="w-full mb-2 px-3 py-2 rounded border border-white/10 bg-white/10" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input type="password" className="w-full mb-2 px-3 py-2 rounded border border-white/10 bg-white/10" placeholder="Mot de passe" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="btn w-full">S'inscrire</button>
        </form>
        {msg && <p className="muted mt-2">{msg}</p>}
        <p className="muted mt-3 text-sm">Déjà inscrit ? <Link className="underline" href="/login">Se connecter</Link></p>
      </div>
    </main>
  );
}
EOF

################################
# AI API routes (tutor, flashcards, qcm generator)
################################
cat > "$APP/app/api/ai/tutor/route.ts" <<'EOF'
import { aiModel } from "@/lib/ai";
import { streamText } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages, focus } = await req.json().catch(()=>({ messages: [], focus: "résidanat" }));
  const result = await streamText({
    model: aiModel(),
    system: `Tu es un tuteur clinique pour la préparation du résidanat (Constantine). 
- Style: concis, structuré, focus high-yield (inspiré AMBOSS).
- Méthode: active recall, indices progressifs, "why not" pour distracteurs, tableaux comparatifs quand utile.
- Refuse les diagnostics définitifs; propose des hypothèses, examens complémentaires et prise en charge standardisée.
- Toujours inclure: perles cliniques, drapeaux rouges, écueils d'examen.
- Ne fournis pas d'informations dangereuses ou spécifiques au patient réel. Usage uniquement pédagogique.`,
    messages,
    temperature: 0.2,
  });
  return result.toAIStreamResponse();
}
EOF

cat > "$APP/app/api/ai/flashcards/route.ts" <<'EOF'
import { aiModel } from "@/lib/ai";
import { generateObject } from "ai";
import { z } from "zod";

export const runtime = "edge";

export async function POST(req: Request) {
  const { text, n = 12 } = await req.json();
  const schema = z.object({
    cards: z.array(z.object({
      front: z.string(),
      back: z.string(),
      hint: z.string().optional()
    })).max(50)
  });
  const { object } = await generateObject({
    model: aiModel(),
    schema,
    prompt: `Génère ${n} flashcards Q/A (format résidanat), ultra high-yield et non redondantes à partir du contenu suivant:\n${text}\nRéponses précises (guidelines), formulations claires, 1 idée par carte.`
  });
  return new Response(JSON.stringify(object), { headers: { "Content-Type": "application/json" } });
}
EOF

cat > "$APP/app/api/ai/qcm/route.ts" <<'EOF'
import { aiModel } from "@/lib/ai";
import { generateObject } from "ai";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/server";

export const runtime = "edge";

export async function POST(req: Request) {
  const { topic, category_id, count = 10 } = await req.json();
  const schema = z.object({
    questions: z.array(z.object({
      question: z.string(),
      options: z.array(z.string()).min(4).max(6),
      answer_index: z.number().min(0).max(5),
      explanation: z.string().optional()
    })).max(50)
  });

  const { object } = await generateObject({
    model: aiModel(),
    schema,
    prompt: `Génère ${count} QCM cliniques de niveau résidanat sur "${topic}". 
Contraintes:
- 1 bonne réponse, 3-5 distracteurs plausibles
- Phrases simples, pas d'ambiguïté, pièges réalistes
- Ajoute une explication brève et exacte (guidelines) pour la correction.`
  });

  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const supa = supabaseAdmin();
    const payload = (object.questions || []).map((q: any) => ({
      category_id, question: q.question, options: q.options, answer_index: q.answer_index, explanation: q.explanation || null
    }));
    if (payload.length) await supa.from("qcms").insert(payload);
  }

  return new Response(JSON.stringify(object), { headers: { "Content-Type": "application/json" } });
}
EOF

################################
# App entry (theme provider)
################################
cat > "$APP/app/api/hello/route.ts" <<'EOF'
export const runtime = "edge";
export function GET() { return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } }); }
EOF

################################
# Supabase schema (SQL + RLS)
################################
cat > "$APP/supabase/migrations/0001_init.sql" <<'EOF'
-- Extensions
create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  role text default 'student',
  created_at timestamptz default now()
);

-- Courses
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text check (category in ('medecine','chirurgie','pediatrie')) not null,
  price int default 0,
  hours int default 0,
  image text,
  created_at timestamptz default now()
);

-- Enrollments
create table if not exists public.enrollments (
  user_id uuid references auth.users(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, course_id)
);

-- QCM Categories
create table if not exists public.qcm_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique
);

-- QCM Questions
create table if not exists public.qcms (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.qcm_categories(id) on delete cascade,
  question text not null,
  options jsonb not null,
  answer_index int not null,
  explanation text,
  created_at timestamptz default now()
);

-- Attempts
create table if not exists public.qcm_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  category_id uuid references public.qcm_categories(id) on delete set null,
  question_id uuid references public.qcms(id) on delete set null,
  answer_index int,
  correct boolean,
  created_at timestamptz default now()
);

-- Spaced repetition cards (SM-2)
create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  front text not null,
  back text not null,
  hint text,
  ef float default 2.5,
  reps int default 0,
  interval int default 0,
  due_date date default (now()::date),
  last_grade int default 0,
  deck text default 'default',
  source_type text,
  source_id uuid,
  created_at timestamptz default now()
);

-- Contact messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.qcm_categories enable row level security;
alter table public.qcms enable row level security;
alter table public.qcm_attempts enable row level security;
alter table public.cards enable row level security;
alter table public.messages enable row level security;

-- Policies

-- profiles: user sees only self
create policy "read own profile" on public.profiles for select using (auth.uid() = id);
create policy "insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "update own profile" on public.profiles for update using (auth.uid() = id);

-- courses: public read, no write (admin via service role)
create policy "read courses" on public.courses for select using (true);

-- enrollments: user manages own
create policy "insert own enrollment" on public.enrollments for insert with check (auth.uid() = user_id);
create policy "read own enrollment" on public.enrollments for select using (auth.uid() = user_id);
create policy "delete own enrollment" on public.enrollments for delete using (auth.uid() = user_id);

-- qcm_categories: public read
create policy "read qcm categories" on public.qcm_categories for select using (true);

-- qcms: public read
create policy "read qcms" on public.qcms for select using (true);

-- attempts: user only
create policy "write attempts" on public.qcm_attempts for insert with check (auth.uid() = user_id);
create policy "read own attempts" on public.qcm_attempts for select using (auth.uid() = user_id);

-- cards (SM-2): user only
create policy "write cards" on public.cards for insert with check (auth.uid() = user_id);
create policy "read cards" on public.cards for select using (auth.uid() = user_id);
create policy "update cards" on public.cards for update using (auth.uid() = user_id);

-- messages: allow insert by anyone (rate-limit côté app)
create policy "create messages" on public.messages for insert with check (true);
EOF

################################
# Simple seeds
################################
cat > "$APP/supabase/migrations/0002_seed.sql" <<'EOF'
insert into public.qcm_categories (id, name, slug) values
  (gen_random_uuid(), 'Médecine Interne', 'medecine'),
  (gen_random_uuid(), 'Chirurgie', 'chirurgie'),
  (gen_random_uuid(), 'Pédiatrie', 'pediatrie');

-- Exemples de cours
insert into public.courses (title, description, category, price, hours, image) values
  ('Médecine Interne', 'Pathologies majeures et protocoles', 'medecine', 15000, 48, 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=60'),
  ('Chirurgie Générale', 'Techniques et urgences fréquentes', 'chirurgie', 18000, 52, 'https://images.unsplash.com/photo-1580281657527-47e6ba6c4962?auto=format&fit=crop&w=800&q=60'),
  ('Pédiatrie', 'Cas cliniques et PEC', 'pediatrie', 12000, 40, 'https://images.unsplash.com/photo-1584015936565-c3f6e1440722?auto=format&fit=crop&w=800&q=60');

-- Quelques QCM d'exemple
with c as (select id from public.qcm_categories where slug='medecine' limit 1)
insert into public.qcms (category_id, question, options, answer_index, explanation)
select id, 'Traitement de 1ère intention de l HTA essentielle ?', '["Régime seul","IEC/ARA2","Diurétique","Bêta-bloquant"]'::jsonb, 1, 'IEC/ARA2 privilégiés selon profil' from c;
EOF

################################
# README
################################
cat > "$APP/README.md" <<'EOF'
# Résidanat Constantine – Next.js + Supabase + Vercel + IA

- Next.js 14 (App Router, TS, Tailwind)
- Supabase (Auth, DB, RLS)
- IA intégrée (Vercel AI SDK + OpenAI/OpenRouter)
- Codespaces-ready (devcontainer), Vercel deploy-ready

## Démarrage
1) cp .env.example .env.local
2) Remplir les clés Supabase et OPENAI_API_KEY
3) pnpm install (ou npm install)
4) pnpm dev (ou npm run dev) → http://localhost:4000

## Base de données
- Importer les migrations SQL dans Supabase (Table Editor > SQL) : supabase/migrations/0001_init.sql puis 0002_seed.sql

## Déploiement Vercel
- Connecte le repo, ajoute les variables d'environnement (Vercel dashboard)
- Vercel détectera Next.js automatiquement

EOF

################################
# Minimal index for API sanity
################################
cat > "$APP/app/(app)/page.tsx" <<'EOF'
export default function AppPage() {
  return null; // placeholder to keep (app) group
}
EOF

################################
# Install deps if available
################################
cd "$APP"
PKG=""
if command -v pnpm >/dev/null 2>&1; then
  PKG="pnpm"
elif command -v npm >/dev/null 2>&1; then
  PKG="npm"
fi

if [ -n "$PKG" ]; then
  echo "📦 Installation des dépendances avec $PKG ..."
  if [ "$PKG" = "pnpm" ]; then pnpm install; else npm install; fi
else
  echo "⚠️  Aucun gestionnaire de paquets trouvé (pnpm/npm). Installe d'abord Node.js."
fi

echo "✅ Projet généré: $APP"
echo "Prochaines étapes:"
echo "1) Ouvre dans Codespaces (ou local) et crée .env.local d'après .env.example"
echo "2) Colle les migrations SQL dans Supabase (0001 puis 0002)"
echo "3) Lance le dev: pnpm dev (ou npm run dev) → http://localhost:4000"
echo "4) Configure Vercel (variables d'env), puis déploie"