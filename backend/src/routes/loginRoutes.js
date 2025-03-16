const express = require('express');
const { loginUser } = require('../controllers/loginController');  // Importa el controlador
const router = express.Router();


router.post('/', loginUser);  // Define el endpoint para el inicio de sesión

module.exports = router;
