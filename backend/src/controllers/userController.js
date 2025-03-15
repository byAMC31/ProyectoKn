const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const { Op } = require('sequelize');
const { validateEmail, validatePassword } = require('../utils/validations');



// Obtiene todos los users con las especificaciones
const getUsers = async (req, res) => {
  const { page = 1, limit = 10, role, status, search } = req.query;

  // Validar valores de página y límite
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  if (isNaN(pageNumber) || pageNumber <= 0) {
    return res.status(400).json({ message: 'El número de página debe ser mayor que 0.' });
  }

  if (isNaN(limitNumber) || limitNumber <= 0) {
    return res.status(400).json({ message: 'El límite debe ser mayor que 0.' });
  }

  const offset = (pageNumber - 1) * limitNumber;

  try {
    const whereConditions = {};

    // Filtrar por rol si se especifica
    if (role) {
      whereConditions.role = role;
    }

    // Filtrar por estado si se especifica
    if (status) {
      whereConditions.status = status;
    }

    // Filtrar por búsqueda de nombre o correo si se especifica
    if (search) {
      whereConditions[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Obtener usuarios con paginación, filtrado y búsqueda
    const { count, rows } = await User.findAndCountAll({
      where: whereConditions,
      limit: limitNumber,
      offset,
    });

    // Calcular el total de páginas
    const totalPages = Math.ceil(count / limitNumber);

    // Verificar si hay resultados
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron usuarios que coincidan con los filtros.' });
    }

    // Responder con los datos de paginación y los usuarios encontrados
    res.json({
      page: pageNumber,
      limit: limitNumber,
      totalPages,
      totalUsers: count,
      users: rows,
    });
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios', error });
  }
};




// Obtener un usuario por su ID
const getUserById = async (req, res) => {
  const { id } = req.params;  // Obtener el ID desde los parámetros de la URL
  try {
    const user = await User.findByPk(id); // Buscar usuario por ID
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(user);  // Devolver el usuario si se encuentra
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
};



// Registrar nuevos usuarios
const registerUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phoneNumber, role, status, address } = req.body;
    const profilePicture = req.file?.path || null; // Si se subió una imagen, obtiene su ruta
    const errors = []; // Array para almacenar los errores

    // Verificar que los campos requeridos estén presentes
    if (!email) {
      errors.push('El correo electrónico es obligatorio.');
    } else if (!validateEmail(email)) {
      errors.push('El correo electrónico no es válido.');
    }

    if (!password) {
      errors.push('La contraseña es obligatoria.');
    } else if (!validatePassword(password)) {
      errors.push('La contraseña no cumple con los requisitos de seguridad.');
    }

    if (!firstName) {
      errors.push('El nombre es obligatorio.');
    }

    if (!lastName) {
      errors.push('Los apellidos son obligatorios.');
    }

    if (!phoneNumber) {
      errors.push('El número de teléfono es obligatorio.');
    }

    // Validar roles permitidos
    const allowedRoles = ['Admin', 'User'];
    if (role && !allowedRoles.includes(role)) {
      errors.push('El rol especificado no es válido.');
    }

    // Validar estados permitidos
    const allowedStatuses = ['Active', 'Inactive'];
    if (status && !allowedStatuses.includes(status)) {
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




// Actualizar un usuario 
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, firstName, lastName, phoneNumber, role, status, address } = req.body;
  const profilePicture = req.file?.path || null; // Si se subió una imagen, obtiene su ruta
  const errors = []; // Array para almacenar los errores

  try {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }

    console.log(`Buscando usuario con ID: ${userId}`);
    const user = await User.findByPk(userId);

    if (!user) {
      console.log('Usuario no encontrado');
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Validar email
    if (email && !validateEmail(email)) {
      errors.push('El correo electrónico no es válido.');
    }

    // Verificar si otro usuario ya tiene el mismo email
    if (email && email !== user.email) {
      console.log(`Verificando si el email ya está en uso: ${email}`);
      const existingUserByEmail = await User.findOne({
        where: {
          email,
          id: { [Op.ne]: userId }, // Excluir el usuario actual
        },
      });

      if (existingUserByEmail) {
        console.log('Email ya registrado por otro usuario');
        errors.push('El email ya está registrado por otro usuario');
      }
    }

    // Si hay errores, devolverlos todos en un solo response
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Crear un objeto con los campos a actualizar
    const updateData = {};

    // Solo actualizamos los campos si hay un cambio
    if (firstName && firstName !== user.firstName) updateData.firstName = firstName;
    if (lastName && lastName !== user.lastName) updateData.lastName = lastName;
    if (email && email !== user.email) updateData.email = email;
    if (phoneNumber && phoneNumber !== user.phoneNumber) updateData.phoneNumber = phoneNumber;
    if (role && role !== user.role) updateData.role = role;
    if (status && status !== user.status) updateData.status = status;
    // Comparar la dirección
    if (address) {
      const { street, number, city, postalCode } = address;
      const currentAddress = user.address || {};
      if (
        street !== currentAddress.street ||
        number !== currentAddress.number ||
        city !== currentAddress.city ||
        postalCode !== currentAddress.postalCode
      ) {
        updateData.address = address;
      }
    }
    if (profilePicture && profilePicture !== user.profilePicture) updateData.profilePicture = profilePicture;

    // Verificamos si hay cambios
    if (Object.keys(updateData).length === 0) {
      console.log('No se realizaron cambios en el usuario');
      return res.status(400).json({ message: 'No se realizaron cambios en el usuario' });
    }

    console.log(`Actualizando usuario ID ${userId}`);
    const [updatedRows] = await User.update(updateData, { where: { id: userId } });

    if (updatedRows === 0) {
      console.log('No se realizaron cambios en el usuario');
      return res.status(400).json({ message: 'No se realizaron cambios en el usuario' });
    }

    console.log('Usuario actualizado correctamente');
    res.json({ message: 'Usuario actualizado correctamente' });

  } catch (error) {
    console.error('Error en la actualización:', error);
    res.status(500).json({ message: 'Error al actualizar usuario', error });
  }
};




module.exports = { registerUser, deleteUser, updateUser, getUsers, getUserById };
