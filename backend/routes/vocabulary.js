const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/vocabularyController');

router.get('/', ctrl.getAll);
router.get('/search/query', ctrl.search);
router.get('/stats/summary', ctrl.getStats);
router.get('/lookup/:word', ctrl.lookup);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);

module.exports = router;
