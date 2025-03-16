const { sequelize } = require('../config/database'); // Importa la instancia de Sequelize
const User = require('../models/userModel'); // Importa el modelo de User
const { faker } = require('@faker-js/faker'); 
const bcrypt = require('bcrypt'); 

// Función para generar un usuario falso
function generateFakeUser() {
  return {
    firstName: faker.person.firstName(), 
    lastName: faker.person.lastName(), 
    email: faker.internet.email(),
    password: faker.internet.password(60),
    phoneNumber: faker.phone.number(), 
    role: faker.helpers.arrayElement(['Admin', 'User']),
    status: faker.helpers.arrayElement(['Active', 'Inactive']),
    address: {
      street: faker.location.streetAddress(), 
      number: faker.location.buildingNumber(),
      city: faker.location.city(), 
      postalCode: faker.location.zipCode(), 
    },
    profilePicture: faker.image.avatar(),
    passwordChangedAt: faker.date.past(),
  };
}

// Función para sembrar la base de datos con 50 usuarios y un usuario predeterminado
async function seedUsers() {
  try {
    // Verifica si la tabla de usuarios está vacía
    const userCount = await User.count();
    if (userCount > 0) {
      console.log('La tabla de usuarios ya tiene datos. No se crearán usuarios.');
      return;
    }

    // Genera 50 usuarios falsos
    const users = Array.from({ length: 50 }, generateFakeUser);

    // Hashea la contraseña del usuario predeterminado
    const hashedPassword = await bcrypt.hash('password', 10); // Hashea la contraseña "password"

    // Agrega el usuario predeterminado
    const defaultUser = {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: hashedPassword, // Usa la contraseña hasheada
      phoneNumber: faker.phone.number(),
      role: 'Admin',
      status: 'Active',
      address: {
        street: faker.location.streetAddress(), 
        number: faker.location.buildingNumber(),
        city: faker.location.city(), 
        postalCode: faker.location.zipCode(), 
      },
      profilePicture: faker.image.avatar(),
      //passwordChangedAt: new Date(),
    };

    // Agrega el usuario predeterminado al array de usuarios
    users.push(defaultUser);

    // Inserta los usuarios en la base de datos
    await User.bulkCreate(users);
    console.log('50 usuarios y un usuario predeterminado creados exitosamente.');
  } catch (error) {
    console.error('Error al crear usuarios:', error);
  }
}

module.exports = seedUsers; // Exporta la función seedUsers