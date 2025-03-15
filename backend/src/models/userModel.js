const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Ensure this path is correct

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('Admin', 'User'), // Define los roles como un enum con los valores 'Admin' y 'User'
    allowNull: false,
    defaultValue: 'User',  // El valor por defecto es 'User'
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive'), 
    allowNull: false,
    defaultValue: 'Active',  // El valor por defecto es 'Active'
  },
  address: {
    type: DataTypes.JSONB,  // Utilizamos JSONB para almacenar un objeto (dirección)
    allowNull: true,
    defaultValue: {},  // Valor por defecto es un objeto vacío
  },
  profilePicture: {
    type: DataTypes.STRING, // URL de la foto de perfil
    allowNull: true,
  },
  passwordChangedAt: {
    type: DataTypes.DATE,  // Campo para registrar cuando cambia la contraseña
    allowNull: true,
  }
}, {
  timestamps: false,   // No timestamps
  tableName: 'users',  // Nombre de la tabla
});

module.exports = User;




