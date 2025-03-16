require('dotenv').config();
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
//const sequelize = require('./config/database'); 
const { initializeDatabase } = require('./config/database');
const seedUsers = require('./config/userSeeder'); 

// Configurar dotenv
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());


// Aplicación de Helmet como middleware para mejorar la seguridad HTTP.
app.use(helmet({  
  contentSecurityPolicy: {  // Configura la Política de Seguridad de Contenido (CSP).
    directives: {  // Define las reglas de seguridad para los recursos cargados en la aplicación.
      defaultSrc: ["'self'"],  // Solo permite cargar contenido desde el mismo dominio (previene inyecciones de contenido externo).
      scriptSrc: ["'self'"],  // Restringe la ejecución de scripts solo a los alojados en el mismo dominio (bloquea scripts externos maliciosos).
      objectSrc: ["'none'"],  // Bloquea la carga de contenido en `<object>`, `<embed>` y `<applet>` (previene ataques como clickjacking).
      upgradeInsecureRequests: [],  // Si el usuario accede por HTTP, intenta redirigir automáticamente a HTTPS.
    },
  },
  xssFilter: true
}));


//const urlS = `http://${process.env.DB_HOST}:${process.env.PORT}`;
const urlS = `http://localhost:${PORT}`;


// Rutas de la API
const userRoutes = require('./routes/userRoutes');
app.use('/api/v1/users', userRoutes);


// Ruta para el inicio de sesión
const loginRoutes = require('./routes/loginRoutes');  // Importa las rutas de login
app.use('/api/v1/login', loginRoutes);  // Establece la ruta para el inicio de sesión

// Inicializa la base de datos y luego inicia el servidor
async function startServer() {
  try {
    // Inicializa la base de datos (verifica y crea si no existe)
    await initializeDatabase();

    await seedUsers();
    // Inicia el servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en ${urlS}`);
    });

  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1); // Termina el proceso si hay un error
  }
}

// Solo inicia el servidor si no está en modo de prueba
if (process.env.NODE_ENV !== 'test') {
  startServer();
}


// Exportar la instancia de la app y el servidor para las pruebas
module.exports = { app, startServer };