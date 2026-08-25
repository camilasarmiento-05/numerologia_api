/**
 * Se activa cuando ninguna ruta coincidió con la petición.
 * Debe registrarse DESPUÉS de todas las rutas.
 */
function notFound(req, res, next) {
  res.status(404).json({ mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

/**
 * Manejador de errores centralizado. Captura cualquier error que llegue
 * por next(error) o que se lance dentro de un middleware/controlador.
 * Debe registrarse AL FINAL, después de notFound.
 */
function errorHandler(err, req, res, next) {
  console.error('Error no controlado:', err);
  res.status(500).json({ mensaje: 'Error interno del servidor', error: err.message });
}

module.exports = { notFound, errorHandler };
