"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useState } from "react";

export default function NavBar() {
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<any>(null);

  return (
    <header className="navbar">
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className="font-bold text-lg">🎓 Résidanat Constantine</Link>
        <nav className="hidden md:flex items-center gap-4">
          <Link href="/formations" className="btn-outline">Formations</Link>
          <Link href="/qcm" className="btn-outline">QCM</Link>
          <Link href="/simulateur" className="btn-outline">Simulateur</Link>
        </nav>
        <div className="flex items-center gap-2">
          <button className="btn-soft px-3 py-2 rounded" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>🌓</button>
          {user ? (
            <>
              <Link href="/profil" className="btn-soft px-3 py-2 rounded">{user.email}</Link>
              <button className="btn-soft px-3 py-2 rounded" onClick={() => setUser(null)}>Déconnexion</button>
            </>
          ) : (
            <button className="btn" onClick={() => setUser({ email: "test@example.com" })}>Connexion</button>
          )}
        </div>
      </div>
    </header>
  );
}
