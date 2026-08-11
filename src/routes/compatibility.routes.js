const express = require('express');
const router = express.Router();
const { check } = require('../controllers/compatibility.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/check', authMiddleware, check);

module.exports = router;
