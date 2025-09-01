module.exports = (err, req, res, next) => {
  console.error('Erreur:', err);
  res.status(err.status || 500).json({ message: err.message || 'Erreur serveur' });
};
