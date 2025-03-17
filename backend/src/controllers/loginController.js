require('dotenv').config();  
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');


const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Verificar si el usuario existe
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Generar token JWT con expiración
    const token = jwt.sign(
      { id: user.id, email: user.email, passwordChangedAt: user.passwordChangedAt, role: user.role},
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.json({ message: 'Inicio de sesión exitoso', token });

  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = { loginUser };
