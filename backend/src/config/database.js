require('dotenv').config();  // Cargar variables de entorno antes de cualquier otro import

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',  
    port: process.env.DB_PORT || 5432,  // Puerto por defecto para PostgreSQL
    charset: 'utf8', 
    logging: false,  // Para desactivar los logs de SQL 
  }
);

module.exports = sequelize;
