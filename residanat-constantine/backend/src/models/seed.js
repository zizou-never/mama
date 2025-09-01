const { readDB, writeDB } = require('./db');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');

module.exports = function seed() {
  const db = readDB();
  let changed = false;

  if (!db.users || db.users.length === 0) {
    const admin = {
      id: uuid(),
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@residanat.dz',
      password: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'Admin#2025', 10),
      role: 'admin',
      courses: []
    };
    db.users = [admin];
    changed = true;
  }

  if (!db.courses || db.courses.length === 0) {
    db.courses = [
      {
        id: uuid(),
        title: "Médecine Interne",
        description: "Formation complète couvrant les pathologies majeures et protocoles.",
        category: "medecine",
        price: 15000,
        hours: 48,
        image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=60",
        content: [
          { title: "Cardiologie", items: ["HTA", "Insuffisance cardiaque", "SCA"] },
          { title: "Endocrinologie", items: ["Diabète", "Thyroïde"] }
        ],
        students: []
      },
      {
        id: uuid(),
        title: "Chirurgie Générale",
        description: "Approche pratique des techniques et procédures essentielles.",
        category: "chirurgie",
        price: 18000,
        hours: 52,
        image: "https://images.unsplash.com/photo-1580281657527-47e6ba6c4962?auto=format&fit=crop&w=800&q=60",
        content: [
          { title: "Abdomen aigu", items: ["Appendicite", "Cholécystite"] },
          { title: "Traumatologie", items: ["Fractures", "Polytraumatisme"] }
        ],
        students: []
      },
      {
        id: uuid(),
        title: "Pédiatrie",
        description: "Module spécialisé avec cas cliniques et PEC.",
        category: "pediatrie",
        price: 12000,
        hours: 40,
        image: "https://images.unsplash.com/photo-1584015936565-c3f6e1440722?auto=format&fit=crop&w=800&q=60",
        content: [
          { title: "Infectiologie", items: ["Bronchiolite", "Rougeole"] },
          { title: "Croissance", items: ["Courbes", "Dépistage"] }
        ],
        students: []
      }
    ];
    changed = true;
  }

  if (!db.qcmCategories || db.qcmCategories.length === 0) {
    db.qcmCategories = [
      { id: uuid(), name: "Médecine Interne", slug: "medecine" },
      { id: uuid(), name: "Chirurgie", slug: "chirurgie" },
      { id: uuid(), name: "Pédiatrie", slug: "pediatrie" }
    ];
    changed = true;
  }

  if (!db.qcms || db.qcms.length === 0) {
    const med = db.qcmCategories.find(c => c.slug === 'medecine');
    const chir = db.qcmCategories.find(c => c.slug === 'chirurgie');
    const ped = db.qcmCategories.find(c => c.slug === 'pediatrie');

    db.qcms = [
      // Médecine interne
      {
        id: uuid(),
        categoryId: med.id,
        question: "Quel est le traitement de première intention de l'HTA essentielle ?",
        options: ["Régime sans sel", "IEC/ARA2", "Diurétique seul", "Bêta-bloquant systématique"],
        answerIndex: 1,
        explanation: "Les IEC/ARA2 sont recommandés en première intention selon les profils."
      },
      // Chirurgie
      {
        id: uuid(),
        categoryId: chir.id,
        question: "L'appendicite aiguë est due principalement à :",
        options: ["Infection virale", "Obstruction appendiculaire", "Traumatisme", "Parasitoses"],
        answerIndex: 1,
        explanation: "L'obstruction par fécalithe est la cause la plus fréquente."
      },
      // Pédiatrie
      {
        id: uuid(),
        categoryId: ped.id,
        question: "Chez le nourrisson, la bronchiolite est le plus souvent causée par :",
        options: ["VRS", "Influenza", "Adénovirus", "Coronavirus"],
        answerIndex: 0,
        explanation: "Le virus respiratoire syncytial est le plus souvent en cause."
      }
    ];
    changed = true;
  }

  if (changed) writeDB(db);
};
