const { get, set, readDB, writeDB } = require('../models/db');
const { v4: uuid } = require('uuid');

exports.getCategories = (req, res) => {
  res.json(get('qcmCategories'));
};

exports.createCategory = (req, res) => {
  const { name, slug } = req.body || {};
  if (!name || !slug) return res.status(400).json({ message: 'Champs requis: name, slug' });
  const cats = get('qcmCategories');
  if (cats.find(c => c.slug === slug)) return res.status(409).json({ message: 'Slug déjà utilisé' });
  const cat = { id: uuid(), name, slug };
  cats.push(cat);
  set('qcmCategories', cats);
  res.status(201).json(cat);
};

exports.getQuestionsByCategory = (req, res) => {
  const { limit } = req.query;
  const catId = req.params.categoryId;
  const all = get('qcms').filter(q => q.categoryId === catId);
  const n = Number(limit) || all.length;
  res.json(all.slice(0, n));
};

exports.createQuestion = (req, res) => {
  const { categoryId } = req.params;
  const { question, options, answerIndex, explanation } = req.body || {};
  if (!question || !Array.isArray(options) || options.length < 2 || typeof answerIndex !== 'number') {
    return res.status(400).json({ message: 'Champs requis: question, options[], answerIndex' });
  }
  const db = readDB();
  if (!db.qcmCategories.find(c => c.id === categoryId)) return res.status(404).json({ message: 'Catégorie introuvable' });
  const q = { id: uuid(), categoryId, question, options, answerIndex, explanation: explanation || '' };
  db.qcms.push(q);
  writeDB(db);
  res.status(201).json(q);
};
