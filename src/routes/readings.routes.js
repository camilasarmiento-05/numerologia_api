const express = require('express');
const router = express.Router();
const { generate, getHistory } = require('../controllers/readings.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { validarLectura } = require('../middlewares/validate.middleware');

router.post('/generate', authMiddleware, validarLectura, generate);
router.get('/history', authMiddleware, getHistory);

module.exports = router;
