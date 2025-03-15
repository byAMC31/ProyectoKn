const express = require('express');
const {getAllUsers, registerUser, deleteUser} = require('../controllers/userController');
const upload = require('../middlewares/multerConfig');

const router = express.Router();

// Ruta para obtener todos los usuarios
router.get('/', getAllUsers);


// Ruta para crear un usuario
router.post("/", upload.single("profilePicture"), registerUser);


// Ruta para eliminar un usuario por su ID
router.delete('/:id', deleteUser);



module.exports = router;
