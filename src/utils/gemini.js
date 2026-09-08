const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Envía un prompt a Gemini y devuelve el texto de la respuesta.
 */
async function generarTexto(prompt) {
  const model = genAI.getGenerativeModel({ model: 'gemini-3.7-flash' });
  const resultado = await model.generateContent(prompt);
  return resultado.response.text();
}

module.exports = { generarTexto };
