const router = require('express').Router();
const ctrl = require('../controllers/qcm.controller');
const { auth, adminOnly } = require('../middleware/auth.middleware');

router.get('/categories', ctrl.getCategories);
router.post('/categories', auth, adminOnly, ctrl.createCategory);
router.get('/categories/:categoryId/questions', ctrl.getQuestionsByCategory);
router.post('/categories/:categoryId/questions', auth, adminOnly, ctrl.createQuestion);

module.exports = router;
