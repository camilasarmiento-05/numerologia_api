const express = require('express');
const router = express.Router();
const { calculate, getProfile } = require('../controllers/numerology.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/calculate', authMiddleware, calculate);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
