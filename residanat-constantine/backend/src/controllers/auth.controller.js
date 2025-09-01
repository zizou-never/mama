const { get, set } = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');

function sanitize(user) {
  const { password, ...rest } = user;
  return rest;
}

exports.register = (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ message: 'Champs requis: name, email, password' });

  const users = get('users');
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ message: 'Email déjà utilisé' });
  }

  const user = {
    id: uuid(),
    name,
    email: email.toLowerCase(),
    password: bcrypt.hashSync(password, 10),
    role: 'student',
    courses: []
  };
  users.push(user);
  set('users', users);

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return res.status(201).json({ token, user: sanitize(user) });
};

exports.login = (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Champs requis: email, password' });

  const users = get('users');
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return res.status(401).json({ message: 'Identifiants invalides' });
  if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ message: 'Identifiants invalides' });

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return res.json({ token, user: sanitize(user) });
};

exports.me = (req, res) => {
  const users = get('users');
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
  res.json({ user: sanitize(user) });
};

exports.listUsers = (req, res) => {
  const users = get('users').map(u => ({ ...u, password: undefined }));
  res.json(users);
};
