const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Asegurarse de que la carpeta 'uploads' exista, si no, crearla
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Usar la ruta absoluta para la carpeta 'uploads' dentro de 'src/'
    cb(null, uploadsDir); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Filtros para permitir solo imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de archivo no válido. Solo se permiten .jpg, .jpeg y .png'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;