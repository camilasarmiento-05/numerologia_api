const AuditLog = require('../models/AuditLog');

/**
 * Registra cada petición importante en la colección AuditLogs:
 * endpoint, método, status_code, fecha y el usuario (si venía autenticado).
 * Se guarda cuando la respuesta termina (evento 'finish'), para poder
 * incluir el status_code real que se le devolvió al cliente.
 */
function auditMiddleware(req, res, next) {
  res.on('finish', () => {
    const log = new AuditLog({
      endpoint: req.originalUrl,
      metodo: req.method,
      status_code: res.statusCode,
      user_id: req.user ? req.user.id : undefined
    });

    log.save().catch((error) => {
      console.error('Error al guardar el log de auditoría:', error.message);
    });
  });

  next();
}

module.exports = auditMiddleware;
