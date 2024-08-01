const productos = [
    { nombre: "Cereales", precio: 300, cantidad: 100, imagen: "1.png" },
    { nombre: "Carne", precio: 390, cantidad: 50, imagen: "2.png" },
    { nombre: "Azucar", precio: 500, cantidad: 20, imagen: "3.png" },
    { nombre: "Fideos", precio: 60, cantidad: 21, imagen: "4.png" },
    { nombre: "Arroz", precio: 260, cantidad: 30, imagen: "5.png" },
    { nombre: "Café", precio: 39, cantidad: 60, imagen: "6.png" },
    { nombre: "Miel", precio: 239, cantidad: 10, imagen: "7.png" },
    { nombre: "Pan Lactal", precio: 180, cantidad: 90, imagen: "8.png" },
    { nombre: "Harina", precio: 190, cantidad: 100, imagen: "9.png" },
    { nombre: "Yerba", precio: 1900, cantidad: 10, imagen: "10.png" },
    { nombre: "Queso", precio: 1800, cantidad: 120, imagen: "11.png" },
    { nombre: "Jamon", precio: 1780, cantidad: 110, imagen: "12.png" }
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

        const cantidadDisponibleElemento = document.getElementById(`stock_${nombreProducto}`);
        if (cantidadDisponibleElemento) {
            cantidadDisponibleElemento.textContent = `Stock: ${producto.cantidad}`;
        }

        document.getElementById(`precio_${nombreProducto}`).innerText = totalProducto;
        actualizarTotalCompra();
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: '¡Compra realizada con éxito!',
            showConfirmButton: false,
            timer: 1500
        });

    } else {

        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Ingrese una cantidad mayor a cero o no hay suficiente stock.',
            showConfirmButton: true,
            timer: 3000
        });
    }
}

function actualizarTotalCompra() {
    let totalCompra = 0;

    productos.forEach(producto => {
        let cantidad = Number(document.getElementById(`cant_${producto.nombre}`).value);
        let precio = producto.precio;
        totalCompra += cantidad * precio;
    });

    const descuentoEn = 100000;
    const descuentoPorcentaje = 0.30;

    let totalConDescuento = totalCompra;
    if (totalCompra >= descuentoEn) {
        totalConDescuento = totalCompra * (1 - descuentoPorcentaje)
    }

    document.getElementById("total").innerText = `${totalCompra.toFixed(2)}`;
    document.getElementById("total_con_descuento").innerText = `Total con descuento: $${totalConDescuento.toFixed(2)}`;
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

        const cantidadDisponibleElemento = document.createElement("p");
        cantidadDisponibleElemento.id = `stock_${producto.nombre}`;
        cantidadDisponibleElemento.textContent = `Stock: ${producto.cantidad}`;

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
        tarjetaProducto.appendChild(cantidadDisponibleElemento);

        contenedorProductos.appendChild(tarjetaProducto);

    });
}

document.addEventListener("DOMContentLoaded", () => {
    generarTarjetasProductos();
    actualizarTotalCompra();
});
