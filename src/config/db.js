const mongoose = require('mongoose');

/**
 * Conexión a MongoDB Atlas usando Mongoose.
 * La cadena de conexión se lee desde la variable de entorno MONGO_URI
 * (ver .env.example).
 */
async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error('MONGO_URI no está definida en el archivo .env');
    }

    await mongoose.connect(uri);

    console.log('✅ MongoDB Atlas conectado correctamente');
    console.log('📂 Base de datos:', mongoose.connection.db.databaseName);
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
