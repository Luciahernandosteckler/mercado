// Variable global para productos
let productos = [];

// Cargar productos desde el archivo JSON y guardarlos en localStorage
fetch('../data/productos.json') // Ajusta la ruta según tu estructura de carpetas
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Datos cargados desde JSON:', data);
        localStorage.setItem('productos', JSON.stringify(data));
        // Inicializa productos y actualiza la vista
        inicializar(); // Llama a inicializar después de guardar los datos
    })
    .catch(error => console.error('Error cargando el archivo JSON:', error));

// Carga productos desde localStorage
function cargarProductosDesdeLocalStorage() {
    const productosJSON = localStorage.getItem('productos');
    console.log('Productos desde localStorage en productos.js:', productosJSON); // Debugging
    if (productosJSON) {
        try {
            return JSON.parse(productosJSON);
        } catch (e) {
            console.error('Error al parsear productos desde localStorage:', e);
            return [];
        }
    }
    return [];
}

// Inicializa productos y actualiza la vista
function inicializar() {
    productos = cargarProductosDesdeLocalStorage(); // Asigna a la variable global
    console.log('Productos después de cargar en inicializar:', productos); // Debugging

    if (productos.length > 0) {
        generarTarjetasProductos(); // Usa productos desde la variable global
        actualizarTotalCompra();    // Usa productos desde la variable global
    } else {
        console.error('No se encontraron productos en localStorage.');
    }
}

// Genera tarjetas de productos
function generarTarjetasProductos() {
    const contenedorProductos = document.getElementById("productos-container");
    contenedorProductos.innerHTML = ''; // Limpiar contenido previo

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
        inputCantidadProducto.min = "1"; // Asegura que el número mínimo sea 1

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

// Actualiza el total de la compra
function actualizarTotalCompra() {
    let totalCompra = 0;

    productos.forEach(producto => {
        const cantidad = parseInt(document.getElementById(`cant_${producto.nombre}`).value, 10) || 0;
        totalCompra += cantidad * producto.precio;
    });

    const descuentoEn = 100000;
    const descuentoPorcentaje = 0.30;

    const totalConDescuento = totalCompra >= descuentoEn
        ? totalCompra * (1 - descuentoPorcentaje)
        : totalCompra;

    document.getElementById("total-sin-descuento").innerText = `${totalCompra.toFixed(2)}`;
    document.getElementById("total-con-descuento").innerText = `Total con descuento: $${totalConDescuento.toFixed(2)}`;
}

// Maneja la compra de un producto
function comprarProducto(nombreProducto) {
    const producto = productos.find(p => p.nombre === nombreProducto);
    const cantidadSeleccionada = parseInt(document.getElementById(`cant_${nombreProducto}`).value, 10);

    if (!producto || isNaN(cantidadSeleccionada) || cantidadSeleccionada < 1 || cantidadSeleccionada > producto.cantidad) {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Ingrese una cantidad válida o no hay suficiente stock.',
            showConfirmButton: true,
            timer: 1000
        });
        return;
    }

    const totalProducto = calcularTotalProducto(nombreProducto);

    if (totalProducto > 0) {
        producto.cantidad -= cantidadSeleccionada;

        const cantidadDisponibleElemento = document.getElementById(`stock_${nombreProducto}`);
        if (cantidadDisponibleElemento) {
            cantidadDisponibleElemento.textContent = `Stock: ${producto.cantidad}`;
        }

        document.getElementById(`precio_${nombreProducto}`).innerText = `Precio total: $${totalProducto}`;

        actualizarTotalCompra(); // Actualiza el total general

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: '¡Compra realizada con éxito!',
            showConfirmButton: false,
            timer: 1000
        });
    }
}

// Calcula el total de un producto específico
function calcularTotalProducto(nombreProducto) {
    const cantidadSeleccionada = parseInt(document.getElementById(`cant_${nombreProducto}`).value, 10);
    const producto = productos.find(p => p.nombre === nombreProducto);

    if (!producto || isNaN(cantidadSeleccionada) || cantidadSeleccionada < 1) {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Ingrese una cantidad válida',
            showConfirmButton: true,
            timer: 1000
        });
        return 0; // Retorna 0 si hay un error
    }

    return cantidadSeleccionada * producto.precio;
}

// Espera a que el DOM se cargue para inicializar
document.addEventListener('DOMContentLoaded', inicializar);

