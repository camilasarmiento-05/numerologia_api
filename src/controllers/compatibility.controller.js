const CompatibilityMatch = require('../models/CompatibilityMatch');
const NumerologyProfile = require('../models/NumerologyProfile');
const { generarTexto } = require('../utils/gemini');

/**
 * Puntaje simple basado en qué tan parecidos son los números de ambos perfiles.
 * Mientras menor la diferencia total, más alto el puntaje (máximo 100).
 */
function calcularPuntaje(perfil1, perfil2) {
  const diferencia =
    Math.abs(perfil1.numero_vida - perfil2.numero_vida) +
    Math.abs(perfil1.numero_expresion - perfil2.numero_expresion) +
    Math.abs(perfil1.numero_alma - perfil2.numero_alma);

  return Math.max(0, 100 - diferencia * 5);
}

async function check(req, res) {
  try {
    const { id_otro_usuario } = req.body;

    const perfil1 = await NumerologyProfile.findOne({ usuario: req.user.id });
    const perfil2 = await NumerologyProfile.findOne({ usuario: id_otro_usuario });

    if (!perfil1 || !perfil2) {
      return res.status(404).json({ mensaje: 'Alguno de los usuarios no tiene perfil numerológico' });
    }

    const puntaje = calcularPuntaje(perfil1, perfil2);

    const prompt = `Eres un numerólogo experto. Analiza la compatibilidad entre dos personas con estos números:\n` +
      `Persona 1: Camino de Vida ${perfil1.numero_vida}, Expresión ${perfil1.numero_expresion}, Alma ${perfil1.numero_alma}.\n` +
      `Persona 2: Camino de Vida ${perfil2.numero_vida}, Expresión ${perfil2.numero_expresion}, Alma ${perfil2.numero_alma}.\n` +
      `El puntaje de compatibilidad calculado es ${puntaje} sobre 100. ` +
      `Escribe en español una interpretación cálida de 3 a 4 párrafos sobre esta relación.`;

    const interpretacion = await generarTexto(prompt);

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
