const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const { validarRegistro, validarLogin } = require('../middlewares/validate.middleware');

router.post('/register', validarRegistro, register);
router.post('/login', validarLogin, login);

module.exports = router;
