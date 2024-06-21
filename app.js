const express = require('express');
const path = require('path');
const multer = require('multer');
const mysql = require('mysql');

const app = express();
const port = 3001;


const upload = multer({ dest: 'imagenes/' });

const connection = mysql.createConnection({
    host: '10.0.6.39',
    user: 'estudiante',
    password: 'Info-2023',
    database: 'Gatos'
});

connection.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos: ' + err.stack);
        return;
    }
    console.log('Conexión exitosa a la base de datos.');
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/style', express.static(path.join(__dirname, 'style')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/imagenes', express.static(path.join(__dirname, 'imagenes')));
app.use('/pagina_principal', express.static(path.join(__dirname, 'pagina_principal')));
app.use(express.static(path.join(__dirname, 'pagina_principal')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pagina_principal', 'login.html'));
});

app.post('/submit_login', (req, res) => {

    const { email, password } = req.body;
    const sql = 'Select Id_Rol from Usuarios where CorreoElectronico = ? and Contraseña = ? ';
    connection.query(sql, [email, password], (err, result) => {

        if (err) {
            console.log('Error al iniciar session: ' + err);

        } else if (result.length > 0) {
            const rol = result[0].Id_Rol;
            if (rol === 1) {
                console.log('Admin: ');
                res.redirect('/IndexAdmin.html');
            } else if (rol === 2) {
                console.log('comun: ');
                res.redirect('/IndexNormal.html');
            }else {
                console.log('error ' + err);
            }

        } else {
            res.send('Correo o contraseña incorrecta')

        }

    });
});

app.post('/submit_adoption_form', (req, res) => {
    const validacionRol = 'SELECT COUNT(Id_Rol) as Cantidad_Roles FROM Roles HAVING COUNT(Id_Rol) >= 2';

    connection.query(validacionRol, (err, result) => {
        if (err) {
            console.error('Error al verificar Roles:', err);
            return res.status(500).send('Error en el servidor al verificar roles');
        } else if (result.length > 0) {
            console.log('Roles ya agregados');
            insertarUsuario(req, res);  // Llamar a la función para insertar el usuario
        } else {
            const insertarRol = "INSERT INTO Roles (nombre, rol) VALUES ('Administrador', 1)";
            const insertarRol2 = "INSERT INTO Roles (nombre, rol) VALUES ('UsuarioNormal', 2)";
            connection.query(insertarRol, (err, result) => {
                if (err) {
                    console.error('Error al insertar el rol Administrador:', err);
                    return res.status(500).send('Error en el servidor al insertar rol Administrador');
                } else {
                    console.log('Rol Administrador agregado');
                    connection.query(insertarRol2, (err, result) => {
                        if (err) {
                            console.error('Error al insertar el rol UsuarioNormal:', err);
                            return res.status(500).send('Error en el servidor al insertar rol UsuarioNormal');
                        } else {
                            console.log('Rol UsuarioNormal agregado');
                            insertarUsuario(req, res);
                        }
                    });
                }
            });
        }
    });
});

function insertarUsuario(req, res) {
    const { rut, nombre, correo, contraseña, contraseña2, direccion, rol } = req.body;

    if (contraseña !== contraseña2) {
        return res.status(400).send('Las contraseñas no coinciden');
    }

    const insertUserSql = 'INSERT INTO Usuarios (Rut, Nombre, CorreoElectronico, Contraseña, Direccion, Id_Rol) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(insertUserSql, [rut, nombre, correo, contraseña, direccion, rol], (err, result) => {
        if (err) {
            console.error('Error en la inserción de la base de datos:', err);
            return res.status(500).send('Error en el servidor');
        }

        const updateUserSql = 'UPDATE Usuarios SET Contraseña2 = ? WHERE CorreoElectronico = ?';
        connection.query(updateUserSql, [contraseña2, correo], (err, result) => {
            if (err) {
                console.error('Error en la actualización de la base de datos:', err);
            }
            console.log('Usuario registrado correctamente.');
            res.redirect('/login.html');
        });
    });
}



//Ruta para peticions para subir imagenes en la base de datos
app.post('/subir_imagenesAdmin', upload.single('imagen'), (req, res) => {
    //Extraigo los datos de la url
    const {Color, Estirilizado , Sexo, Raza } = req.body;
    //extraigo la imagen de la url
    const imagen = req.file.filename;
    //Defino la consulta sql para insertar la imagen
    const sql = 'INSERT INTO Gatitos (Color, Estirilizado ,Sexo ,Raza, imagen) VALUES (?, ? , ?, ? , ?)';
    //Ejecuto la consulta sql con los valores extraidos
    connection.query(sql, [Color , Estirilizado, Sexo, Raza,  imagen ], (err) => {
        if(err) throw err;
        //Si es exitosa
        res.redirect('/IndexAdmin.html');
    });
});

app.post('/subir_imagenes', upload.single('imagen'), (req, res) => {
    //Extraigo los datos de la url
    const {Color, Estirilizado, Sexo, Raza } = req.body;
    //extraigo la imagen de la url
    const imagen = req.file.filename;
    //Defino la consulta sql para insertar la imagen
    const sql = 'INSERT INTO Gatitos (Color, Estirilizado,Sexo,Raza, imagen) VALUES (?, ? , ?, ? , ?)';
    //Ejecuto la consulta sql con los valores extraidos
    connection.query(sql, [Color , Estirilizado, Sexo, Raza,  imagen ], (err) => {
        if(err) throw err;
        //Si es exitosa
        res.redirect('/IndexNormal.html');
    });
});
//Peticion para objetener las imagenes

app.get('/imagenes', (req, res) =>{
    const sql = "select Color, Estirilizado, Sexo, Raza, imagen from Gatitos";
    connection.query(sql, (err, result) => {
        if(err){
            console.error('Error al obtener los datos de la BDD' + err.stack);
            res.status(500).send('Error al obtener los datos de la BDD');
            return;
        }
        //SI los datos existen los convierto en formato json
        res.json(result);
    });

});



// Ruta para mostrar los usuarios en el listardatos.html con método GET
app.get('/usuarios', (req, res) => {
    // Realiza una consulta SQL para seleccionar todas las filas de la tabla "Usuarios"
    connection.query('SELECT * FROM Usuarios', (err, rows) => {
        // Maneja los errores, si los hay
        if (err) throw err;
        res.send(rows); // Aquí puedes enviar la respuesta como quieras (por ejemplo, renderizar un HTML o enviar un JSON)
    });
});

// Define una ruta DELETE en la aplicación Express para eliminar un usuario por su Rut
app.delete('/eliminar_usuario/:rut', (req, res) => {
    // Obtiene el parámetro 'rut' de la URL para eliminar el usuario específico
    const rut = req.params.rut;
    // Define la consulta SQL para eliminar un usuario donde el Rut coincida
    const sql = 'DELETE FROM Usuarios WHERE Rut = ?';
    // Ejecuta la consulta SQL, utilizando el Rut que se enviará a la consulta SQL
    connection.query(sql, [rut], (err, result) => {
        // Si ocurre un error durante la ejecución de la consulta, lanza una excepción
        if (err) throw err;
        // Imprime un mensaje en la consola indicando que el usuario fue eliminado correctamente
        console.log('Usuario eliminado correctamente.');
        // Envía una respuesta HTTP 200 OK al cliente, indicando que la eliminación fue exitosa
        res.sendStatus(200);
    });
});


app.post('/modificar_usuario', (req, res) => {
    // Desestructura los datos del cuerpo de la solicitud (req.body)
    const { rut, nombre, correo, contraseña, confirmar_contraseña, direccion } = req.body;

    if (contraseña !== confirmar_contraseña) {
        return res.status(400).send('Las contraseñas no coinciden');
    }

    // Consulta SQL para actualizar los datos del usuario en la base de datos
    const sql = 'UPDATE Usuarios SET Nombre = ?, CorreoElectronico = ?, Contraseña = ?, Contraseña2 = ?, Direccion = ? WHERE Rut = ?';
    // Ejecuta la consulta SQL
    connection.query(sql, [nombre, correo, contraseña, confirmar_contraseña, direccion, rut], (err, result) => {
        if (err) {
            // Si ocurre un error, muestra un mensaje en la consola y envía una respuesta de error al cliente
            console.error('Error al modificar el usuario:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        // Si la actualización es exitosa, muestra un mensaje en la consola
        console.log('Usuario modificado correctamente.');
        // Redirecciona al usuario a la página de listado de usuarios
        res.redirect('/pagina_principal/Index.html');
    });
});


// Ruta para obtener los datos de un usuario por su Rut
app.get('/usuarios/:rut', (req, res) => {
    // Extraer el Rut de los parámetros de la solicitud
    const rut = req.params.rut;
    // Ejecutar una consulta SQL para obtener los datos del usuario con el Rut proporcionado
    connection.query('SELECT * FROM Usuarios WHERE Rut = ?', [rut], (err, result) => {
        if (err) {
            // Manejar el error si ocurre durante la consulta
            console.error('Error al obtener los datos del usuario:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        // Verificar si no se encontró ningún usuario con el Rut proporcionado
        if (result.length === 0) {
            res.status(404).send('Usuario no encontrado');
            return;
        }
        // Enviar los datos del usuario como respuesta en formato JSON
        res.json(result[0]);
    });
});
app.listen(port, () => {
    console.log('Servidor corriendo en http://localhost:3001');
});
