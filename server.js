require('dotenv').config();

const express = require('express');
const connectDB = require('./src/config/db');

const User = require('./src/models/User');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

const authRoutes = require('./src/routes/auth.routes');
const numerologyRoutes = require('./src/routes/numerology.routes');
const readingsRoutes = require('./src/routes/readings.routes');
const compatibilityRoutes = require('./src/routes/compatibility.routes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/numerology', numerologyRoutes);
app.use('/api/v1/readings', readingsRoutes);
app.use('/api/v1/compatibility', compatibilityRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API de Numerología funcionando ',
  });
});

async function iniciar() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(` Servidor corriendo en http://localhost:${PORT}`);
  });
}

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

iniciar();
