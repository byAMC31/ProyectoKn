require('dotenv').config();
const { Sequelize } = require('sequelize');
const { Client } = require('pg');

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

// Función para verificar y crear la base de datos si no existe
async function ensureDatabaseExists() {
  const client = new Client({
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT || 5432,
    database: 'postgres', // Conéctate a la base de datos predeterminada 'postgres'
  });

  try {
    await client.connect();
    console.log('Conexión a la BD establecida correctamente.');

    // Verifica si la base de datos existe
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'`);
    if (res.rowCount === 0) {
      console.log(`Creando la base de datos: ${DB_NAME}...`);
      await client.query(`CREATE DATABASE "${DB_NAME}";`);
      console.log(`Base de datos ${DB_NAME} creada exitosamente.`);
    } else {
      console.log(`La base de datos ${DB_NAME} ya existe.`);
    }
  } catch (error) {
    console.error('Error al verificar/crear la base de datos:', error);
    throw error; // Relanza el error para detener la ejecución si algo falla
  } finally {
    await client.end(); // Cierra la conexión
  }
}

// Crear la instancia de Sequelize
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
  port: DB_PORT || 5432,
  logging: false,
});

// Función para inicializar la base de datos y Sequelize
async function initializeDatabase() {
  try {
    // Verifica y crea la base de datos si no existe
    await ensureDatabaseExists();

    // Autentica la conexión con Sequelize
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    // Sincroniza los modelos con la base de datos
    await sequelize.sync({ force: false }); // Cambia a `true` si quieres recrear las tablas
    console.log('Tablas sincronizadas exitosamente.');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    process.exit(1); // Termina el proceso si hay un error
  }
}

// Exporta la instancia de Sequelize y la función de inicialización
module.exports = { sequelize, initializeDatabase };