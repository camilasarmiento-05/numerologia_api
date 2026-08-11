const NumerologyProfile = require('../models/NumerologyProfile');

async function calculate(req, res) {
  try {
    // TODO Fase 3: aquí van los algoritmos reales de suma y reducción numerológica.
    const numero_vida = 0;
    const numero_expresion = 0;
    const numero_alma = 0;

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
