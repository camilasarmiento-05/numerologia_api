const NumerologyProfile = require('../models/NumerologyProfile');
const User = require('../models/User');
const {
  calcularNumeroVida,
  calcularNumeroExpresion,
  calcularNumeroAlma
} = require('../utils/numerologia');

async function calculate(req, res) {
  try {
    const usuario = await User.findById(req.user.id);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const numero_vida = calcularNumeroVida(usuario.fecha_nacimiento);
    const numero_expresion = calcularNumeroExpresion(usuario.nombre_completo);
    const numero_alma = calcularNumeroAlma(usuario.nombre_completo);

    const perfil = new NumerologyProfile({
      usuario: req.user.id,
      numero_vida,
      numero_expresion,
      numero_alma
    });

    await perfil.save();

    res.status(201).json({ mensaje: 'Perfil numerológico calculado', perfil });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al calcular el perfil', error: error.message });
  }
}

async function getProfile(req, res) {
  try {
    const perfil = await NumerologyProfile.findOne({ usuario: req.user.id });

    if (!perfil) {
      return res.status(404).json({ mensaje: 'Este usuario aún no tiene perfil numerológico' });
    }

    res.status(200).json(perfil);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el perfil', error: error.message });
  }
}

module.exports = { calculate, getProfile };
