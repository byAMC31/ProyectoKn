const request = require('supertest');
const { app, startServer } = require('../index'); // Import app, and startServer
const User = require('../models/userModel');

describe('Pruebas de los endpoints de usuarios', () => {
    let token; // Variable para almacenar el token de autenticación
    let userId; // ID del usuario de prueba

    // Iniciar el servidor antes de todas las pruebas
    beforeAll(async () => {
        await User.destroy({ where: {} }); // Limpiar la base de datos antes de las pruebas
        await startServer(); // Start the server

        // Registrar un usuario para la prueba
        const userResponse = await request(app)
            .post('/api/v1/users/register')
            .send({
                firstName: 'ad',
                lastName: 'ddd',
                email: 'ad.marttt3@example.com',
                password: 'SecurePass123!',
                phoneNumber: '9514978080',
                role: 'User',
                status: 'Active',
                address: {
                    street: 'Avenida Principal',
                    number: '123',
                    city: 'Oaxaca',
                    postalCode: '68000'
                }
            });

        userId = userResponse.body.id; // Guardar el ID del usuario registrado

        // Iniciar sesión para obtener el token
        const loginResponse = await request(app)
            .post('/api/v1/login/')
            .send({
                email: 'ad.marttt3@example.com',
                password: 'SecurePass123!',
            });

        token = loginResponse.body.token; // Guardamos el token para futuras peticiones
    });




    // Test de registro de usuario exitoso
    test('Debe registrar un nuevo usuario', async () => {
        const response = await request(app)
            .post('/api/v1/users/register')
            .send({
                firstName: 'ad',
                lastName: 'ddd',
                email: 'ad.marttt33@example.com',
                password: 'SecurePass123!',
                phoneNumber: '9514978080',
                role: 'User',
                status: 'Active',
                address: {
                    street: 'Avenida Principal',
                    number: '123',
                    city: 'Oaxaca',
                    postalCode: '68000'
                }
            });

        expect(response.status).toBe(201); // Esperamos que el código de estado sea 201
        expect(response.body.email).toBe('ad.marttt33@example.com');
        expect(response.body.firstName).toBe('ad');
        expect(response.body.lastName).toBe('ddd');
        expect(response.body.phoneNumber).toBe('9514978080');
        expect(response.body.role).toBe('User');
        expect(response.body.status).toBe('Active');
        expect(response.body.address.street).toBe('Avenida Principal');
        expect(response.body.address.number).toBe('123');
        expect(response.body.address.city).toBe('Oaxaca');
        expect(response.body.address.postalCode).toBe('68000');
    });




    // Test de validación de contraseña en el registro
    test('Debe retornar un error si la contraseña no cumple con los requisitos de seguridad', async () => {
        const response = await request(app)
            .post('/api/v1/users/register')
            .send({
                firstName: 'Adrian',
                lastName: 'Martinez',
                email: 'userNuevo@example.com',
                password: 'test', // Contraseña que no cumple con los requisitos
                phoneNumber: '9513598080',
                role: 'User',
                status: 'Active',
                address: {
                    street: 'Avenida Principal',
                    number: '123',
                    city: 'Oaxaca',
                    postalCode: '68000'
                }
            });

        expect(response.status).toBe(400); // Esperamos un error 400
        expect(response.body.errors).toContain(
            'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una minúscula, un dígito y un carácter especial.'
        );
    });



    // Test de login 
    test('Debe iniciar sesión correctamente y retornar un token', async () => {

        await request(app)
            .post('/api/v1/users/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'testuser48@example.com',
                password: "SecurePass123!",
                phoneNumber: '9514888080',
                role: 'User',
                status: 'Active',
                address: {
                    street: 'Avenida Principal',
                    number: '123',
                    city: 'Oaxaca',
                    postalCode: '68000'
                }
            });

        // Posteriormente probar con el usuario registrado
        const response = await request(app)
            .post('/api/v1/login')
            .send({
                email: 'testuser48@example.com',
                password: "SecurePass123!"
            });

        expect(response.status).toBe(200); // Debería retornar un código 200 si el login fue exitoso
        expect(response.body.token).toBeDefined(); // El token JWT debe estar presente
    });



    test('Debe retornar un error si las credenciales son incorrectas', async () => {
        const response = await request(app)
            .post('/api/v1/login')
            .send({
                email: 'testuser4@example.com', // Usuario registrado previamente
                password: 'ContraseñaIncorrecta123!', // Contraseña incorrecta
            });
        expect(response.status).toBe(401); // Debería retornar 401 Unauthorized
        expect(response.body).toHaveProperty('message', 'Credenciales incorrectas'); // Mensaje esperado
    });





    // Test para actualizar un usuario que no existe
    test('Debe retornar un error si el usuario que se desea actualizar no existe', async () => {
        // ID que sabemos que no existe en la base de datos
        const nonExistentUserId = 99999;
        // Intentar actualizar un usuario con un ID inexistente
        const response = await request(app)
            .put(`/api/v1/users/${nonExistentUserId}`)  // Usamos el ID de usuario inexistente
            .set('Authorization', `Bearer ${token}`)  // Agregar el token a la cabecera
            .send({
                firstName: "Adrianzz",
                lastName: "Martinezzzz",
                email: "adyy.marttt@example.com",
            });
        expect(response.status).toBe(404);  // Debería retornar un error 404 porque el usuario no existe
        expect(response.body.message).toBe('Usuario no encontrado');  // El mensaje debe ser "Usuario no encontrado"
    });



    //Test para eliminar un usuario que no existe
    test('Debe retornar un error si el usuario a eliminar no existe', async () => {
        const nonExistentUserId = 99999;

        const response = await request(app)
            .delete(`/api/v1/users/${nonExistentUserId}`)
            .set('Authorization', `Bearer ${token}`);  // Enviamos el token válido

        expect(response.status).toBe(404);  // Debe retornar un código 404
        expect(response.body.message).toBe('Usuario no encontrado');  // Mensaje esperado
    });



    // Test para obtener un usuario por su ID
    test('Debe obtener un usuario por su ID correctamente', async () => {
        const response = await request(app)
            .get(`/api/v1/users/${userId}`)  // Petición al endpoint con el ID
            .set('Authorization', `Bearer ${token}`);  // Agregar el token en la cabecera

        expect(response.status).toBe(200);  // Debe retornar código 200
        expect(response.body).toHaveProperty('id', userId);  
        expect(response.body).toHaveProperty('email', 'ad.marttt3@example.com'); 
        expect(response.body).toHaveProperty('firstName', 'ad');  
        expect(response.body).toHaveProperty('lastName', 'ddd');  
        expect(response.body).toHaveProperty('phoneNumber', '9514978080');  
        expect(response.body).toHaveProperty('role', 'User');  
        expect(response.body).toHaveProperty('status', 'Active');  
        expect(response.body).toHaveProperty('address');  
        expect(response.body.address).toHaveProperty('street', 'Avenida Principal');  
        expect(response.body.address).toHaveProperty('number', '123'); 
        expect(response.body.address).toHaveProperty('city', 'Oaxaca');  
        expect(response.body.address).toHaveProperty('postalCode', '68000');  
    });



    // Test para obtener un usuario que no existe
    test('Debe retornar un error si el usuario no existe', async () => {
        const nonExistentUserId = 99999999; // ID de usuario que no existe en la BD

        const response = await request(app)
            .get(`/api/v1/users/${nonExistentUserId}`) // Intentar obtener el usuario
            .set('Authorization', `Bearer ${token}`); // Enviar el token

        expect(response.status).toBe(404); // Debe retornar 404 Not Found
        expect(response.body).toHaveProperty('message', 'Usuario no encontrado'); // Mensaje de error esperado
    });



    test('Debe retornar un error si la contraseña actual es incorrecta', async () => {
        // Intentamos cambiar la contraseña con una contraseña actual incorrecta
        const response = await request(app)
            .put(`/api/v1/users/${userId}/password`)  // ID del usuario que vamos a actualizar
            .set('Authorization', `Bearer ${token}`)  // Agregar el token al header
            .send({
                oldPassword: 'ContraseñaIncorrecta!',  // Contraseña incorrecta
                newPassword: 'NewPassword123!',  // Nueva contraseña
            });

        expect(response.status).toBe(400);  // El código de estado debe ser 400 (Bad Request)
        expect(response.body.message).toBe('La contraseña actual es incorrecta');  // Mensaje esperado
    });



    // Test para cambiar la contraseña
    test('Debe actualizar la contraseña correctamente', async () => {
        const response = await request(app)
            .put(`/api/v1/users/${userId}/password`)  // Petición al endpoint con el ID
            .set('Authorization', `Bearer ${token}`)  // Agregar el token al header
            .send({
                oldPassword: 'SecurePass123!',  // Contraseña actual
                newPassword: 'NewPassword123!',  // Nueva contraseña
            });
        expect(response.status).toBe(200);  // El código de estado debe ser 200
        expect(response.body.message).toBe('Contraseña actualizada correctamente');  // Mensaje esperado
    });




    // Test para probar que el token se revocó cuando se cambió la contraseña
    test('Debe retornar error que el token no es válido', async () => {
        const response = await request(app)
            .get(`/api/v1/users/${userId}`)  // Petición al endpoint con el ID
            .set('Authorization', `Bearer ${token}`);  // Agregar el token en la cabecera
        expect(response.status).toBe(401);  // Debe retornar código 401
        expect(response.body.message).toBe('El token ha sido revocado. Vuelve a iniciar sesión.');  // Mensaje esperado
    });



});