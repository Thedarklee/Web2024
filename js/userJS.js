window.onload = function () {
    // Realizar una solicitud GET a la ruta /usuarios
    fetch('/usuarios')
        // Procesar la respuesta como JSON
        .then(function (response) {
            return response.json();
        })
        // Cuando se obtienen los datos JSON
        .then(function (data) {
            // Obtener una referencia al elemento HTML con el ID 'usuarios-list'
            var usuariosList = document.getElementById('usuarios-list');
            // Iterar sobre cada usuario en los datos recibidos
            data.forEach(function (usuario) {
                // Crear una nueva fila de tabla
                var row = document.createElement('tr');
                // Establecer el contenido HTML de la fila con los datos del usuario
                row.innerHTML =
                    '<td>' + usuario.Rut + '</td>' +
                    '<td>' + usuario.Nombre + '</td>' +
                    '<td>' + usuario.CorreoElectronico + '</td>' +
                    '<td>' + usuario.Contraseña + '</td>' +
                    '<td>' + usuario.Contraseña2 + '</td>' +
                    '<td>' + usuario.Direccion + '</td>' +
                    '<td>' +
                    '<button onclick="modificarUsuario(\'' + usuario.Rut + '\')">Modificar</button>' +
                    '<button onclick= "verDetalles(\'' + usuario.Rut + '\')" data-bs-toggle="modal" data-bs-target="#detallesModal">Ver detalles</button>' +
                    '<button onclick="prepararEliminar(\'' + usuario.Rut + '\')" data-bs-toggle="modal" data-bs-target="#eliminarModal">Eliminar</button>' +
                    '</td>';
                // Agregar la fila a la lista de usuarios
                usuariosList.appendChild(row);
            });
        });
};


function eliminarUsuario(rut) {
    fetch('/eliminar_usuario/' + rut, {
        method: 'DELETE'
    })
        .then(function (response) {
            if (response.ok) {
                console.log('Usuario eliminado correctamente.');
                // Actualizar la tabla después de eliminar el usuario
                window.location.reload();
            } else {
                console.error('Error al eliminar usuario.');
            }
        })
        .catch(function (error) {
            console.error('Error en la solicitud:', error);
        });
}


function modificarUsuario(rut) {
    // Redirigir a la página de modificación de usuario con el rut correspondiente
    window.location.href = '/pagina_principal/modifyuser.html?rut=' + rut;

}


//aaaaaaaaaaaaaaaaaaaaaaaa
function verDetalles(rut) {
    //Realizo una solicitud para obtener los datos
    fetch("/usuarios/" + rut)
        .then(function (response) {
            return response.json();
        })
        .then(function (usuario) {
            document.getElementById("detallesUsuario").textContent =
                "Rut: " + usuario.Rut +
                "\nNombre: " + usuario.Nombre +
                "\nCorreo: " + usuario.CorreoElectronico +
                "\nContraseña :" + usuario.Contraseña +
                "\nContraseña2: " + usuario.Contraseña2 +
                "\nDireccion: " + usuario.Direccion+ 
                "\nRol: " + usuario.Id_Rol;
        })
        .catch(function (error) {
            console.error("Errpr al mostrar datos ", error);
        });

}




var usuarioAEliminar = null
function prepararEliminar(id) {
    //Asignar el id del usuario a eliminar
    usuarioAEliminar = id;
}
//Generalmos metodo para confirmar la eliminarcion
document.getElementById("confirmarEliminarBtn").addEventListener("click", function () {
    //verificamos que el id no sea nulo
    if (usuarioAEliminar !== null) {
        //Realizo la peticion para eliminar
        fetch("/eliminar_usuario/" + usuarioAEliminar, {
            method: "DELETE"
        })
            .then(function (response) {
                //Verifico si el usuario se elimino
                if (response.ok) {
                    alert("Usuario eliminado exitosamente...")
                    location.reload();

                } else {
                    alert("Error al eliminar usuario")
                }

            })
            .catch(function (error) {
                console.error("Error al ejecutar peticion", error);

            });
    }
});