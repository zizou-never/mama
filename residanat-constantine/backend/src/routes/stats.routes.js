const router = require('express').Router();
const stats = require('../controllers/stats.controller');
const { auth, adminOnly } = require('../middleware/auth.middleware');

router.get('/', stats);

module.exports = router;
