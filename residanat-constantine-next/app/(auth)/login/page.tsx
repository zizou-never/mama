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
