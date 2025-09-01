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
