const CompatibilityMatch = require('../models/CompatibilityMatch');
const NumerologyProfile = require('../models/NumerologyProfile');

async function check(req, res) {
  try {
    const { id_otro_usuario } = req.body;

    const perfil1 = await NumerologyProfile.findOne({ usuario: req.user.id });
    const perfil2 = await NumerologyProfile.findOne({ usuario: id_otro_usuario });

    if (!perfil1 || !perfil2) {
      return res.status(404).json({ mensaje: 'Alguno de los usuarios no tiene perfil numerológico' });
    }

    // TODO Fase 4: comparar perfiles y pedirle a Gemini un análisis real.
    const puntaje = 0;
    const interpretacion = 'Interpretación pendiente de generar por IA en Fase 4';

    const match = new CompatibilityMatch({
      usuario1: req.user.id,
      usuario2: id_otro_usuario,
      puntaje,
      interpretacion
    });

    await match.save();

    res.status(201).json({ mensaje: 'Análisis de compatibilidad creado', match });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al calcular compatibilidad', error: error.message });
  }
}

module.exports = { check };
