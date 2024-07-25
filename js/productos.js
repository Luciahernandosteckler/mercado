const productos = [
    { nombre: "Cereales", precio: 300, cantidad: 100, imagen: "1.jpg" },
    { nombre: "Carne", precio: 390, cantidad: 50, imagen: "2.jpg" },
    { nombre: "Azucar", precio: 500, cantidad: 20, imagen: "3.jpg" },
    { nombre: "Fideos", precio: 60, cantidad: 21, imagen: "4.jpg" },
    { nombre: "Arroz", precio: 260, cantidad: 30, imagen: "5.jpg" },
    { nombre: "Café", precio: 39, cantidad: 60, imagen: "6.jpg" },
    { nombre: "Miel", precio: 239, cantidad: 10, imagen: "7.jpg" },
    { nombre: "Pan Lactal", precio: 180, cantidad: 90, imagen: "8.jpg" },
    { nombre: "Harina", precio: 190, cantidad: 100, imagen: "9.jpg" }
];

function comprarProducto(nombreProducto) {
    let cantidadSeleccionada = Number(document.getElementById(`cant_${nombreProducto}`).value);
    let producto = productos.find(p => p.nombre === nombreProducto);

    if (!producto) {
        return;
    }

    if (cantidadSeleccionada > 0 && producto.cantidad >= cantidadSeleccionada) {
        let totalProducto = cantidadSeleccionada * producto.precio;
        producto.cantidad -= cantidadSeleccionada;
        document.getElementById(`precio_${nombreProducto}`).innerText = totalProducto;
        actualizarTotalCompra();
    } else {
        alert("Ingrese una cantidad mayor a cero o no hay suficiente stock.");
    }
}

function actualizarTotalCompra() {
    let totalCompra = 0;

    productos.forEach(producto => {
        let cantidad = Number(document.getElementById(`cant_${producto.nombre}`).value);
        let precio = producto.precio;
        totalCompra += cantidad * precio;
    });

    document.getElementById("total").innerText = ` total $${totalCompra}`;
}


function generarTarjetasProductos() {
    const contenedorProductos = document.getElementById("productos-container");

    productos.forEach(producto => {
        const tarjetaProducto = document.createElement("div");
        tarjetaProducto.classList.add("card");

        const nombreProductoElemento = document.createElement("p");
        nombreProductoElemento.textContent = producto.nombre;

        const imagenProductoElemento = document.createElement("img");
        imagenProductoElemento.src = `../imagenes/${producto.imagen}`;
        imagenProductoElemento.alt = producto.nombre;

        const precioProductoElemento = document.createElement("p");
        precioProductoElemento.textContent = `Precio: $${producto.precio}`;

        const inputCantidadProducto = document.createElement("input");
        inputCantidadProducto.classList.add("input-productos");
        inputCantidadProducto.type = "number";
        inputCantidadProducto.id = `cant_${producto.nombre}`;
        inputCantidadProducto.min = "0";
        inputCantidadProducto.value = "0";
        inputCantidadProducto.required = true;

        const botonComprarProducto = document.createElement("button");
        botonComprarProducto.classList.add("button-productos");
        botonComprarProducto.textContent = "Comprar";
        botonComprarProducto.addEventListener("click", () => comprarProducto(producto.nombre));

        const precioTotalProductoElemento = document.createElement("p");
        precioTotalProductoElemento.id = `precio_${producto.nombre}`;
        precioTotalProductoElemento.textContent = `Precio total: $0`;

        tarjetaProducto.appendChild(nombreProductoElemento);
        tarjetaProducto.appendChild(imagenProductoElemento);
        tarjetaProducto.appendChild(precioProductoElemento);
        tarjetaProducto.appendChild(inputCantidadProducto);
        tarjetaProducto.appendChild(botonComprarProducto);
        tarjetaProducto.appendChild(precioTotalProductoElemento);

        contenedorProductos.appendChild(tarjetaProducto);


    });
}

document.addEventListener("DOMContentLoaded", () => {
    generarTarjetasProductos();
    actualizarTotalCompra();
});
