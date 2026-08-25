const express = require('express');
const router = express.Router();
const { check } = require('../controllers/compatibility.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { validarCompatibilidad } = require('../middlewares/validate.middleware');

router.post('/check', authMiddleware, validarCompatibilidad, check);

module.exports = router;
