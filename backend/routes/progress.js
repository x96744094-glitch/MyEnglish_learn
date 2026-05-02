const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/progressController');

router.get('/:userId', ctrl.get);
router.post('/:userId', ctrl.update);
router.post('/:userId/notebook/add', ctrl.addToNotebook);
router.get('/:userId/notebook', ctrl.getNotebook);

module.exports = router;
