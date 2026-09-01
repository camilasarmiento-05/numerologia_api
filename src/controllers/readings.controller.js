const Reading = require('../models/Reading');

async function generate(req, res) {
  try {
    const { tipo_lectura } = req.body;

    // TODO Fase 4: construir el prompt real y llamar a Gemini.
    const prompt_enviado = 'Prompt pendiente de construir en Fase 4';
    const respuesta_generada = 'Respuesta pendiente de generar por IA en Fase 4';

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
