const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const { Op } = require('sequelize');
const { validateEmail, validatePassword } = require('../utils/validations');



// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll(); // Obtener todos los usuarios
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};



// Registrar nuevos usuarios
const registerUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phoneNumber, role, status, address } = req.body;
    const profilePicture = req.file?.path || null; // Si se subió una imagen, obtiene su ruta
    const errors = []; // Array para almacenar los errores

    if (!validateEmail(email)) {
      errors.push('El correo electrónico no es válido.');
    }

    if (!validatePassword(password)) {
      errors.push('La contraseña no cumple con los requisitos de seguridad.');
    }

    // Validar roles permitidos
    const allowedRoles = ['Admin', 'User'];
    if (!allowedRoles.includes(role)) {
      errors.push('El rol especificado no es válido.');
    }

    // Validar estados permitidos
    const allowedStatuses = ['Active', 'Inactive'];
    if (!allowedStatuses.includes(status)) {
      errors.push('El estado especificado no es válido.');
    }

    // Validar dirección si está presente
    if (address) {
      const { street, number, city, postalCode } = address;
      if (!street || !number || !city || !postalCode) {
        errors.push('La dirección debe estar completa.');
      }
    }

    // Verificar si el correo ya está registrado
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      errors.push('El correo electrónico ya está registrado.');
    }

    // Si hay errores, devolverlos todos en un solo response
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
      role,
      status,
      address: address || {}, // Si no se envía dirección, se guarda un objeto vacío
      profilePicture,
    });

    return res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phoneNumber: newUser.phoneNumber,
      role: newUser.role,
      status: newUser.status,
      address: newUser.address,
      profilePicture: newUser.profilePicture,
    });

  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    return res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};



// Eliminar un usuario por su ID
const deleteUser = async (req, res) => {
  const { id } = req.params;  // Obtener el ID desde los parámetros de la URL
  try {
    const user = await User.findByPk(id);  // Buscar el usuario por su ID
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    // Eliminar el usuario. Si tienes relaciones en cascada
    await user.destroy();
    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};




module.exports = { getAllUsers, registerUser, deleteUser};
