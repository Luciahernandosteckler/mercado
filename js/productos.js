
let arrProductos = ["cereales", "carne", "azucar", "fideos", "arroz", "cafe", "miel", "panLactal", "harina"];
let arrPrecio = [300, 390, 500, 60, 260, 39, 239, 180, 190];
let arrCant = [100, 50, 20, 21, 30, 60, 10, 90, 100];

function comprar(producto) {
    let cantidad;
    let index = arrProductos.indexOf(producto);

    if (index === -1) {
        return; 
    }

    cantidad = Number(document.getElementById(`cant_${producto}`).value);

    if (cantidad > 0 && (arrCant[index] - cantidad) >= 0) {
        let totalProducto = cantidad * arrPrecio[index];
        arrCant[index] -= cantidad; 
        document.getElementById(`precio_${producto}`).innerText = totalProducto;
        actualizarTotal();
    } else {
        alert("Ingrese una cantidad mayor a cero o no hay suficiente stock.");
    }
}


function actualizarTotal() {
    let total = 0;

    for (let i = 0; i < arrProductos.length; i++) {
        let cantidad = Number(document.getElementById(`cant_${arrProductos[i]}`).value);
        let precio = arrPrecio[i]; 
        total += cantidad * precio; 
    }

    document.getElementById("total").innerText = total;
}

