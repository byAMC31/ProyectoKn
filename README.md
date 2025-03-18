# ProyectoKn

Este documento describe cómo configurar y ejecutar el proyecto, tanto usando Docker como de forma independiente.

## Ejecución con Docker

Para ejecutar el proyecto con Docker, sigue estos pasos:

### 1. Clona el repositorio:
   ```sh
   git clone git@github.com:byAMC31/ProyectoKn.git
   cd ProyectoKn
   ```

### 2. Construye y levanta los contenedores:
   ```sh
   docker-compose up --build
   ```

### 3. Accede a la aplicación:
   - **Frontend**: `http://localhost:5173/`
   - **Backend**: `http://localhost:5000/`
   - **Base de datos** (PostgreSQL en el puerto `5432`).

### 4. Para detener los contenedores:
   ```sh
   docker-compose down
   ```

## Ejecución Independiente (Sin Docker)

Si prefieres ejecutar el proyecto sin Docker, sigue estos pasos:

### 1. Configurar la base de datos (PostgreSQL)

Asegúrate de tener PostgreSQL instalado y accede a la conexión en pgAdmin utilizando tu usuario y contraseña.


### 2. Ejecutar el backend

1. Ve al directorio del backend:
   ```sh
   cd backend
   ```
2. Instala las dependencias:
   ```sh
   npm install
   ```
3. Configura las variables de entorno en un archivo `.env` dentro del nivel de la carpeta de backend:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=
   DB_NAME=ProyectoKn
   JWT_SECRET=clave_secreta14
   ```
> **Nota:** Asegúrate de configurar correctamente las variables de entorno según tu configuración local.


4. Inicia el backend:
   ```sh
   npm start
   ```

> **Nota:** El proyecto está diseñado para crear la base de datos automáticamente. Sin embargo, si se presenta algún error, puedes crearla manualmente en PostgreSQL con el nombre especificado en la configuración (`DB_NAME`).



### 3. Ejecutar el frontend

1. Ve al directorio del frontend:
   ```sh
   cd frontend
   ```
2. Instala las dependencias:
   ```sh
   npm install
   ```
3. Inicia el frontend:
   ```sh
   npm run dev
   ```
4. Accede a `http://localhost:5173/` en el navegador.

---
## Lista de librerías y frameworks utilizados

Este proyecto utiliza **Express (Node.js)** para el backend y **React + Vite** para el frontend. A continuación, se listan las principales dependencias utilizadas:

### Backend (Node.js + Express)
- **Express**: Framework web para Node.js
- **Sequelize**: ORM para manejar bases de datos SQL.
- **pg**: Cliente de PostgreSQL para Node.js, para conectar con la base de datos.
- **jsonwebtoken (JWT)**: Para autenticación basada en tokens.
- **bcrypt**: Para el cifrado seguro de contraseñas.
- **dotenv**: Para manejar variables de entorno.
- **helmet**: Para mejorar la seguridad del servidor.
- **multer**: Middleware para la gestión de archivos en las peticiones HTTP.

### Frontend (React + Vite)
- **React**: Biblioteca de JavaScript para la construcción de interfaces de usuario.
- **Vite**: Herramienta de desarrollo y empaquetado para aplicaciones React.
- **React Router DOM**: Para gestionar la navegación en la aplicación.
- **Material UI (MUI)**: Biblioteca de componentes estilizados para mejorar la interfaz de usuario.
- **Axios**: Cliente HTTP para realizar peticiones al backend.
- **SweetAlert2**: Para la creación de alertas y modales interactivos.

### Herramientas de desarrollo
- **Nodemon**: Para recargar automáticamente el servidor durante el desarrollo.
- **Jest**: Para realizar pruebas unitarias.
- **ESLint**: Para garantizar buenas prácticas en el código.

---


## Implementación

### Resumen de la Implementación  
El proyecto está compuesto por un backend en Node.js con Express y un frontend en React con Vite. Se utilizó PostgreSQL como base de datos, gestionada a través de Sequelize como ORM. Para facilitar el despliegue y la configuración del entorno, se implementó Docker con Docker Compose, permitiendo ejecutar los servicios de manera unificada.

Se decidió utilizar Material UI para la interfaz. Para la autenticación, se implementó JWT, garantizando seguridad en el manejo de sesiones. Además, se utilizó Axios para la comunicación entre el frontend y el backend, asegurando peticiones HTTP eficientes.

---


