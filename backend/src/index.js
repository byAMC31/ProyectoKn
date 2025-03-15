require('dotenv').config(); 
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
//const sequelize = require('./config/database'); 
const sequelize = require('./config/database');

// Configurar dotenv
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());


app.use(helmet({  // Aplica Helmet como middleware para mejorar la seguridad HTTP.
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




// Función para verificar la conexión a la base de datos y sincronizar las tablas
const dbConnection = async () => {
  try {
    // Verificar la conexión
    await sequelize.authenticate();
    console.log('Database online');
    
    // Sincronizar las tablas con la base de datos
    await sequelize.sync({ force: false }); // `force: true` borra y recrea las tablas
    console.log('Tablas sincronizadas exitosamente');
  } catch (error) {
    console.error('Error al conectar o sincronizar la base de datos:', error);
    throw new Error('No se pudo conectar a la base de datos');
  }
};


// Iniciar el servidor después de verificar la conexión a la base de datos
dbConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en ${urlS}`);
    });
  })
  .catch((error) => {
    console.error('No se pudo iniciar el servidor:', error.message);
  });



// Exportar la instancia de la app para las pruebas
module.exports = app;
