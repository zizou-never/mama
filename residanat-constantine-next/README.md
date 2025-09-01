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

