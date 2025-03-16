const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware para validar el token JWT
const validateToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // El token se pasa en el encabezado Authorization como "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    // Verificar la validez del token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar al usuario en la base de datos
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si la fecha de cambio de contraseña es posterior a la fecha de emisión del token
    if (user.passwordChangedAt) {
      const passwordChangedAtTimestamp = new Date(user.passwordChangedAt).getTime() / 1000;  // Convertir a timestamp (segundos)
      
      // Comparar si la fecha de cambio de contraseña es posterior a la fecha de emisión del token
      if (decoded.iat < passwordChangedAtTimestamp) {
        return res.status(401).json({ message: 'El token ha sido revocado. Vuelve a iniciar sesión.' });
      }
    }

    // Añadir la información del usuario al request
    req.user = decoded;
    
    next();  // Continuar con la solicitud si todo está bien
  } catch (error) {
    console.error('Error al verificar el token:', error);
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = { validateToken };
