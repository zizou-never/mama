const router = require('express').Router();
const ctrl = require('../controllers/courses.controller');
const { auth, adminOnly } = require('../middleware/auth.middleware');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/', auth, adminOnly, ctrl.create);
router.put('/:id', auth, adminOnly, ctrl.update);
router.delete('/:id', auth, adminOnly, ctrl.remove);
router.post('/:id/enroll', auth, ctrl.enroll);

module.exports = router;
