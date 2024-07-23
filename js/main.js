let nombre = document.getElementById("nombre");
let apellido = document.getElementById("apellido");
let consulta = document.getElementById("consulta");
let btnEnviar = document.getElementById("enviar");

btnEnviar.addEventListener("click", (e) => {
    e.preventDefault();

    let nombreValor = nombre.value.trim();
    let apellidoValor = apellido.value.trim();
    let consultaValor = consulta.value.trim();

    if (nombreValor === '' || apellidoValor === '' || consultaValor === '') {
        alert('Por favor, complete todos los campos.');
        return;
    }

    let informacion = [nombreValor, apellidoValor, consultaValor];

    console.log(`Su nombre es ${informacion[0]}, su apellido es ${informacion[1]} y su consulta es: ${informacion[2]}`);

    let blob = new Blob([informacion], { type: "text/plain;charset=utf-8" });

    saveAs(blob, "contact.txt");
});
