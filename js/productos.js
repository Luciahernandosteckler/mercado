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
    let cantidadSeleccionada = parseInt(document.getElementById(`cant_${nombreProducto}`).value);
    let producto = productos.find(p => p.nombre === nombreProducto);

    if (!producto) {
        return;
    }

    if (isNaN(cantidadSeleccionada) || cantidadSeleccionada < 1 || cantidadSeleccionada.toString() !== document.getElementById(`cant_${nombreProducto}`).value) {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Ingrese una cantidad válida',
            showConfirmButton: true,
            timer: 1000
        });
        return;
    }

    if (cantidadSeleccionada > 0 && producto.cantidad >= cantidadSeleccionada) {

        let totalProducto = parseInt(cantidadSeleccionada * producto.precio, 10);
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
            timer: 1000
        });

    } else {

        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Ingrese una cantidad mayor a cero o no hay suficiente stock.',
            showConfirmButton: true,
            timer: 1000
        });
    }
}

function actualizarTotalCompra() {
    let totalCompra = 0;

    productos.forEach(producto => {
        let cantidad = Number(document.getElementById(`cant_${producto.nombre}`).value);
        let precio = producto.precio;
        totalCompra += parseInt(cantidad * precio, 10);
    });

    const descuentoEn = 100000;
    const descuentoPorcentaje = 0.30;

    let totalConDescuento = totalCompra;
    if (totalCompra >= descuentoEn) {
        totalConDescuento = totalCompra * (1 - descuentoPorcentaje)
    }

    document.getElementById("total").innerText = `${parseInt(totalCompra, 10)}`;
    document.getElementById("total_con_descuento").innerText = `Total con descuento: $${parseInt(totalConDescuento, 10)}`;
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
        inputCantidadProducto.step = "1";  // Solo números enteros

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


/*BOOSTRAP " estilo carrito"*/

function mostrarDetallesOffcanvas() {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; // Limpiar contenido anterior

    let totalCompra = 0;

    productos.forEach(producto => {
        let cantidad = Number(document.getElementById(`cant_${producto.nombre}`).value) || 0;

        // Validar que la cantidad sea mayor que 0 y no exceda el stock disponible
        if (cantidad > 0 && cantidad <= producto.cantidad) {
            const productoDiv = document.createElement('div');
            productoDiv.className = 'mb-3';

            const nombre = document.createElement('h5');
            nombre.textContent = producto.nombre;

            const cantidadElemento = document.createElement('p');
            cantidadElemento.textContent = `Cantidad: ${cantidad}`;

            const total = document.createElement('p');
            const totalConDescuento = producto.precio * cantidad; 
            total.textContent = `Total: $${totalConDescuento}`;

            // Actualizar el total de la compra
            totalCompra += totalConDescuento;

            productoDiv.appendChild(nombre);
            productoDiv.appendChild(cantidadElemento);
            productoDiv.appendChild(total);

            productList.appendChild(productoDiv);
        }
    });

    // Agregar el total general al final del offcanvas
    const totalDiv = document.createElement('div');
    totalDiv.className = 'mt-3';

    const totalCompraElemento = document.createElement('p');
    totalCompraElemento.textContent = `Total compra: $${totalCompra}`;

    totalDiv.appendChild(totalCompraElemento);
    productList.appendChild(totalDiv);
}

document.querySelector('button[data-bs-toggle="offcanvas"]').addEventListener('click', mostrarDetallesOffcanvas);


