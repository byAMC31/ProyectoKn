const express = require('express');
const {registerUser, deleteUser, updateUser, getUsers, getUserById} = require('../controllers/userController');
const upload = require('../middlewares/multerConfig');

const router = express.Router();

// Ruta para obtener todos los usuarios
router.get('/', getUsers);

//Obtener un usuario por su id
router.get('/:id', getUserById);


// Ruta para crear un usuario
router.post("/", upload.single("profilePicture"), registerUser);


// Ruta para eliminar un usuario por su ID
router.delete('/:id', deleteUser);

// Ruta para actualizar un usuario por su ID
router.put('/:id',  updateUser);



module.exports = router;
