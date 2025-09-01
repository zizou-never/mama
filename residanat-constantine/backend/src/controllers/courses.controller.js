const { get, set, readDB, writeDB } = require('../models/db');
const { v4: uuid } = require('uuid');

exports.getAll = (req, res) => {
  const { q, category } = req.query;
  let courses = get('courses');
  if (category) courses = courses.filter(c => c.category === category);
  if (q) {
    const Q = q.toLowerCase();
    courses = courses.filter(c => c.title.toLowerCase().includes(Q) || c.description.toLowerCase().includes(Q));
  }
  res.json(courses);
};

exports.getOne = (req, res) => {
  const courses = get('courses');
  const course = courses.find(c => c.id === req.params.id);
  if (!course) return res.status(404).json({ message: 'Cours introuvable' });
  res.json(course);
};

exports.create = (req, res) => {
  const { title, description, category, price, hours, image, content } = req.body || {};
  if (!title || !description || !category) return res.status(400).json({ message: 'Champs requis: title, description, category' });
  const courses = get('courses');
  const course = {
    id: uuid(),
    title, description, category,
    price: Number(price) || 0,
    hours: Number(hours) || 0,
    image: image || '',
    content: Array.isArray(content) ? content : [],
    students: []
  };
  courses.push(course);
  set('courses', courses);
  res.status(201).json(course);
};

exports.update = (req, res) => {
  const db = readDB();
  const idx = db.courses.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Cours introuvable' });
  db.courses[idx] = { ...db.courses[idx], ...req.body, id: db.courses[idx].id };
  writeDB(db);
  res.json(db.courses[idx]);
};

exports.remove = (req, res) => {
  const db = readDB();
  const idx = db.courses.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Cours introuvable' });
  const removed = db.courses.splice(idx, 1);
  writeDB(db);
  res.json({ removed: removed[0] });
};

exports.enroll = (req, res) => {
  const db = readDB();
  const course = db.courses.find(c => c.id === req.params.id);
  if (!course) return res.status(404).json({ message: 'Cours introuvable' });
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

  if (!course.students.includes(user.id)) course.students.push(user.id);
  if (!user.courses.includes(course.id)) user.courses.push(course.id);
  writeDB(db);
  res.json({ message: 'Inscription réussie', courseId: course.id, userId: user.id });
};
