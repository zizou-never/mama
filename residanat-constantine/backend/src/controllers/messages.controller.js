const { get, set } = require('../models/db');
const { v4: uuid } = require('uuid');

exports.create = (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ message: 'Champs requis: name, email, message' });
  const messages = get('messages');
  const m = { id: uuid(), name, email, message, date: new Date().toISOString() };
  messages.push(m);
  set('messages', messages);
  res.status(201).json({ message: 'Message reçu', data: m });
};

exports.list = (req, res) => {
  res.json(get('messages'));
};
