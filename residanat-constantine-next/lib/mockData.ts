// Données mockées pour remplacer Supabase
export const mockCourses = [
  {
    id: "1",
    title: "Médecine Interne",
    description: "Pathologies majeures et protocoles",
    category: "medecine",
    price: 15000,
    hours: 48,
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "2",
    title: "Chirurgie Générale",
    description: "Techniques et urgences fréquentes",
    category: "chirurgie",
    price: 18000,
    hours: 52,
    image: "https://images.unsplash.com/photo-1580281657527-47e6ba6c4962?auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "3",
    title: "Pédiatrie",
    description: "Cas cliniques et PEC",
    category: "pediatrie",
    price: 12000,
    hours: 40,
    image: "https://images.unsplash.com/photo-1584015936565-c3f6e1440722?auto=format&fit=crop&w=800&q=60"
  }
];

export const mockQcmCategories = [
  { id: "1", name: "Médecine Interne", slug: "medecine" },
  { id: "2", name: "Chirurgie", slug: "chirurgie" },
  { id: "3", name: "Pédiatrie", slug: "pediatrie" }
];

export const mockQcms = [
  {
    id: "1",
    category_id: "1",
    question: "Traitement de 1ère intention de l'HTA essentielle ?",
    options: ["Régime seul", "IEC/ARA2", "Diurétique", "Bêta-bloquant"],
    answer_index: 1,
    explanation: "IEC/ARA2 privilégiés selon profil"
  }
];
