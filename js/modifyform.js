
        const urlParams = new URLSearchParams(window.location.search);
        const rut = urlParams.get('rut');
        const modificarForm = document.getElementById('modificar-form');
        const rutInput = document.getElementById('usuario-rut');
        const nombreInput = document.getElementById('nombre');
        const correoInput = document.getElementById('correo');
        const contraseñaInput = document.getElementById('contraseña');
        const confirmarcontraseñaInput = document.getElementById('confirmar-contraseña');
        const direccionInput = document.getElementById('direccion');

        fetch('/usuarios/' + rut)
            .then(response => response.json())
            .then(usuario => {
                rutInput.value = usuario.Rut;
                nombreInput.value = usuario.Nombre;
                correoInput.value = usuario.CorreoElectronico;
                contraseñaInput.value = usuario.Contraseña;
                confirmarcontraseñaInput.value = usuario.Contraseña2;
                direccionInput.value = usuario.Direccion;
            })
            .catch(error => console.error('Error en la solicitud:', error));

        modificarForm.addEventListener('submit', function (event) {
            const contraseña = contraseñaInput.value;
            const confirmarcontraseña = confirmarcontraseñaInput.value;
            if (contraseña !== confirmarcontraseña) {
                alert('Las contraseñas no coinciden');
                event.preventDefault();
            }
        });

    $(document).ready(function () {
        function validatePassword() {
            var p1 = $('#contraseña').val();
            var p2 = $('#contraseña2').val();
            var noValido = / /;
            var isValid = true;

            if (p1.length >= 8) {
                $('#length').removeClass('invalid').addClass('valid');
            } else {
                $('#length').removeClass('valid').addClass('invalid');
                isValid = false;
            }

            if (/[A-z]/.test(p1)) {
                $('#letter').removeClass('invalid').addClass('valid');
            } else {
                $('#letter').removeClass('valid').addClass('invalid');
                isValid = false;
            }

            if (/[A-Z]/.test(p1)) {
                $('#capital').removeClass('invalid').addClass('valid');
            } else {
                $('#capital').removeClass('valid').addClass('invalid');
                isValid = false;
            }

            if (/\d/.test(p1)) {
                $('#number').removeClass('invalid').addClass('valid');
            } else {
                $('#number').removeClass('valid').addClass('invalid');
                isValid = false;
            }

            if (p1.length === 0 || p2.length === 0) {
                $('#null').removeClass('valid').addClass('invalid');
                isValid = false;
            } else {
                $('#null').removeClass('invalid').addClass('valid');
            }

            if (p1 === p2) {
                $('#match').removeClass('invalid').addClass('valid');
            } else {
                $('#match').removeClass('valid').addClass('invalid');
                isValid = false;
            }

            if (noValido.test(p1) || noValido.test(p2)) {
                $('#blank').removeClass('valid').addClass('invalid');
                isValid = false;
            } else {
                $('#blank').removeClass('invalid').addClass('valid');
            }

            return isValid;
        }

        $('#registrationForm input[type="password"]').keyup(validatePassword);

        $('#registrationForm input[type="password"]').focus(function () {
            $('#pswd_info').show();
        }).blur(function () {
            $('#pswd_info').hide();
        });
    });

    function validarCorreo() {
        const correo = document.getElementById('correo').value;
        const errorMensaje = document.getElementById('errorMensajeCorreo');
        const patron = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        if (!patron.test(correo)) {
            errorMensaje.style.display = 'block';
            alert('Por favor, ingrese un correo electrónico válido que termine en @gmail.com.');
            return false;
        }

        errorMensaje.style.display = 'none';
        return true;
    }

    function validarFormulario() {
        return validarCorreo() && validatePassword();
    }

