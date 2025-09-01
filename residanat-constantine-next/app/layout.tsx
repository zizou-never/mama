import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Résidanat Constantine",
  description: "Plateforme avancée de préparation au résidanat (Constantine)"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
