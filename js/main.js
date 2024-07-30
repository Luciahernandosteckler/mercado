let nombre = document.getElementById("nombre");
let apellido = document.getElementById("apellido");
let email = document.getElementById("email");
let consulta = document.getElementById("consulta");
let btnEnviar = document.getElementById("enviar");
let emailRegex = /.+@.+\..+/;

btnEnviar.addEventListener("click", (e) => {
    e.preventDefault();

    let nombreValor = nombre.value.trim();
    let apellidoValor = apellido.value.trim();
    let emailValor = email.value.trim();
    let consultaValor = consulta.value.trim();

    if (nombreValor === '' || apellidoValor === '' || emailValor === '' || consultaValor === '') {
        Swal.fire({
            position: 'top-center',
            icon: 'error',
            title: ('Por favor, complete todos los campos.'),
            showConfirmButton: true,
            timer: 3000
        });
        return;
    }

    if (!emailRegex.test(emailValor)) {
        Swal.fire({
            position: 'top-center',
            icon: 'error',
            title: ('Por favor, ingrese un correo electrónico válido que contenga @.'),
            showConfirmButton: true,
            timer: 3000
        });

        return;
    }

    let informacion = [nombreValor, apellidoValor, emailValor, consultaValor];

    console.log(`Su nombre es ${informacion[0]}, su apellido es ${informacion[1]} y su consulta es: ${informacion[2]}`);

    let blob = new Blob([informacion], { type: "text/plain;charset=utf-8" });

    saveAs(blob, "contact.txt");

});
