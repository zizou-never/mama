const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const { auth, adminOnly } = require('../middleware/auth.middleware');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/me', auth, ctrl.me);
router.get('/users', auth, adminOnly, ctrl.listUsers);

module.exports = router;
