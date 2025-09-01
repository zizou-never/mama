const router = require('express').Router();
const ctrl = require('../controllers/messages.controller');
const { auth, adminOnly } = require('../middleware/auth.middleware');

router.post('/', ctrl.create);
router.get('/', auth, adminOnly, ctrl.list);

module.exports = router;
