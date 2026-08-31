function validarRegistro(req, res, next) {
  const { nombre_completo, email, password, fecha_nacimiento } = req.body;

  if (!nombre_completo || !email || !password || !fecha_nacimiento) {
    return res.status(400).json({
      mensaje: 'nombre_completo, email, password y fecha_nacimiento son obligatorios'
    });
  }

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailValido) {
    return res.status(400).json({ mensaje: 'El email no tiene un formato válido' });
  }

  if (password.length < 6) {
    return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
  }

  if (isNaN(Date.parse(fecha_nacimiento))) {
    return res.status(400).json({ mensaje: 'fecha_nacimiento no es una fecha válida' });
  }

  next();
}

function validarLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ mensaje: 'email y password son obligatorios' });
  }

  next();
}

function validarLectura(req, res, next) {
  const { tipo_lectura } = req.body;
  const tiposValidos = ['diaria', 'general', 'anual'];

  if (!tipo_lectura || !tiposValidos.includes(tipo_lectura)) {
    return res.status(400).json({ mensaje: 'tipo_lectura debe ser diaria, general o anual' });
  }

  next();
}

function validarCompatibilidad(req, res, next) {
  const { id_otro_usuario } = req.body;

  if (!id_otro_usuario) {
    return res.status(400).json({ mensaje: 'id_otro_usuario es obligatorio' });
  }

  next();
}

module.exports = {
  validarRegistro,
  validarLogin,
  validarLectura,
  validarCompatibilidad
};
