const Reading = require('../models/Reading');
const NumerologyProfile = require('../models/NumerologyProfile');
const { generarTexto } = require('../utils/gemini');

async function generate(req, res) {
  try {
    const { tipo_lectura } = req.body;

    const perfil = await NumerologyProfile.findOne({ usuario: req.user.id });

    if (!perfil) {
      return res.status(404).json({ mensaje: 'Primero debes calcular tu perfil numerológico' });
    }

    const prompt_enviado = `Eres un numerólogo experto. Genera una lectura de tipo "${tipo_lectura}" ` +
      `para una persona con estos números: Camino de Vida ${perfil.numero_vida}, ` +
      `Expresión ${perfil.numero_expresion}, Alma ${perfil.numero_alma}. ` +
      `Escribe en español, en un tono cálido e inspirador, entre 3 y 5 párrafos.`;

    const respuesta_generada = await generarTexto(prompt_enviado);

    const lectura = new Reading({
      usuario: req.user.id,
      prompt_enviado,
      respuesta_generada,
      tipo_lectura
    });

    await lectura.save();

    res.status(201).json({ mensaje: 'Lectura generada', lectura });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al generar la lectura', error: error.message });
  }
}

async function getHistory(req, res) {
  try {
    const lecturas = await Reading.find({ usuario: req.user.id }).sort({ fecha: -1 });
    res.status(200).json(lecturas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el historial', error: error.message });
  }
}

module.exports = { generate, getHistory };
