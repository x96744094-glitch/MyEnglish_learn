const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/quizController');

router.post('/generate', ctrl.generate);
router.post('/submit', ctrl.submit);
router.get('/history/:userId', ctrl.getHistory);

module.exports = router;
