const express = require('express');
const {registerUser, deleteUser, updateUser, getUsers, getUserById, updateUserPassword} = require('../controllers/userController');
const { validateToken } = require('../middlewares/authMiddleware');  

const upload = require('../middlewares/multerConfig');

const router = express.Router();

// Ruta para crear un usuario
router.post("/register", validateToken, upload.single("profilePicture"), registerUser);

// Ruta para obtener todos los usuarios
router.get('/', validateToken, getUsers);

//Obtener un usuario por su id
router.get('/:id', validateToken, getUserById);

// Ruta para eliminar un usuario por su ID
router.delete('/:id', validateToken,  deleteUser);

// Ruta para actualizar un usuario por su ID
router.put('/:id', validateToken,  updateUser);

// Ruta protegida para cambiar la contraseña
router.put('/:id/password', validateToken, updateUserPassword);



module.exports = router;
