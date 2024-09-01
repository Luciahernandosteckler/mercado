let productos = [];
let carrito = [];

// Función asíncrona para cargar los productos desde un archivo JSON
const cargarProductos = async () => {
    try {
        const respuesta = await fetch('/data/productos.json');
        if (!respuesta.ok) throw new Error('Error en la solicitud de datos');
        return await respuesta.json();
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        return [];
    }
};

// Función para cargar el carrito desde localStorage
const cargarCarrito = () => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito'));
    return carritoGuardado || [];
};

// Función para inicializar la página de productos
const inicializarProductos = async () => {
    productos = await cargarProductos();
    console.log('Productos cargados:', productos);
    if (productos.length > 0) {
        generarTarjetasProductos();
        carrito = cargarCarrito();
        mostrarCarrito();
        actualizarTotalCompra();
    }
};

// Función para calcular el total de un producto específico
const calcularTotalProducto = idProducto => {
    const inputCantidad = document.querySelector(`#cant_${idProducto}`);
    const cantidadSeleccionada = parseInt(inputCantidad?.value, 10) || 0;
    const producto = productos.find(p => p.id === idProducto);
    return cantidadSeleccionada * (producto?.precio || 0);
};

// Función para actualizar el total de compra y aplicar descuento
const actualizarTotalCompra = () => {
    let totalCompra = 0;

    carrito.forEach(item => {
        const producto = productos.find(p => p.id === item.id);
        if (producto) {
            totalCompra += item.cantidad * producto.precio;
        }
    });

    const descuentoEn = 100000;
    const descuentoPorcentaje = 0.30;
    let totalConDescuento;

    if (totalCompra >= descuentoEn) {
        totalConDescuento = totalCompra * (1 - descuentoPorcentaje);
    } else {
        totalConDescuento = totalCompra;
    }

    document.querySelector("#total-sin-descuento").innerText = `$${totalCompra.toFixed(2)}`;
    document.querySelector("#total-con-descuento").innerText = `$${totalConDescuento.toFixed(2)}`;
};

// Función para generar tarjetas de productos en la interfaz
const generarTarjetasProductos = () => {
    const contenedorProductos = document.querySelector("#productos-container");
    contenedorProductos.innerHTML = '';

    productos.forEach(producto => {
        console.log(`Generando tarjeta para producto: ${producto.nombre}`);

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
        cantidadDisponibleElemento.id = `stock_${producto.id}`;
        cantidadDisponibleElemento.textContent = `Stock: ${producto.cantidad}`;

        const inputCantidadProducto = document.createElement("input");
        inputCantidadProducto.classList.add("input-productos");
        inputCantidadProducto.type = "number";
        inputCantidadProducto.id = `cant_${producto.id}`;
        inputCantidadProducto.min = "1";
        inputCantidadProducto.max = producto.cantidad;
        inputCantidadProducto.value = "1";
        inputCantidadProducto.addEventListener("input", () => {
            const precioTotal = calcularTotalProducto(producto.id);
            document.querySelector(`#precio_${producto.id}`).textContent = `Precio total: $${precioTotal.toFixed(2)}`;
            actualizarTotalCompra();
        });

        const botonComprarProducto = document.createElement("button");
        botonComprarProducto.classList.add("button-productos");
        botonComprarProducto.textContent = "Comprar";
        botonComprarProducto.addEventListener("click", () => comprarProducto(producto.id));

        const precioTotalProductoElemento = document.createElement("p");
        precioTotalProductoElemento.id = `precio_${producto.id}`;
        precioTotalProductoElemento.textContent = `Precio total: $${calcularTotalProducto(producto.id).toFixed(2)}`;

        tarjetaProducto.appendChild(nombreProductoElemento);
        tarjetaProducto.appendChild(imagenProductoElemento);
        tarjetaProducto.appendChild(precioProductoElemento);
        tarjetaProducto.appendChild(inputCantidadProducto);
        tarjetaProducto.appendChild(botonComprarProducto);
        tarjetaProducto.appendChild(precioTotalProductoElemento);
        tarjetaProducto.appendChild(cantidadDisponibleElemento);

        contenedorProductos.appendChild(tarjetaProducto);
    });
};

// Función para manejar la compra de un producto
const comprarProducto = async idProducto => {
    const producto = productos.find(p => p.id === idProducto);
    const cantidadSeleccionada = parseInt(document.querySelector(`#cant_${idProducto}`).value, 10);

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

    // Actualiza el stock del producto
    producto.cantidad -= cantidadSeleccionada;
    document.querySelector(`#stock_${idProducto}`).textContent = `Stock: ${producto.cantidad}`;
    document.querySelector(`#precio_${idProducto}`).textContent = `Precio total: $${calcularTotalProducto(idProducto).toFixed(2)}`;

    // Actualiza el carrito
    carrito = cargarCarrito();
    const productoEnCarrito = carrito.find(item => item.id === idProducto);
    if (productoEnCarrito) {
        productoEnCarrito.cantidad += cantidadSeleccionada;
    } else {
        carrito.push({ id: idProducto, cantidad: cantidadSeleccionada });
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));

    await mostrarCarrito();

    Swal.fire({
        position: 'center',
        icon: 'success',
        title: '¡Compra realizada con éxito!',
        showConfirmButton: false,
        timer: 1000
    });
};

// Función para mostrar el contenido del carrito
const mostrarCarrito = () => {
    const carritoContenido = document.querySelector("#carrito-contenido");

    if (!carritoContenido) {
        console.error("Elemento con id 'carrito-contenido' no encontrado");
        return;
    }

    carritoContenido.innerHTML = '';
    let total = 0;

    carrito.forEach(item => {
        const producto = productos.find(p => p.id === item.id);
        if (producto) {
            const itemCarrito = document.createElement("div");
            itemCarrito.classList.add("d-flex", "justify-content-between", "align-items-center", "mb-2");

            const nombreProducto = document.createElement("p");
            nombreProducto.textContent = `${producto.nombre} (x${item.cantidad})`;

            const precioTotal = document.createElement("p");
            const totalItem = item.cantidad * producto.precio;
            precioTotal.textContent = `$${totalItem.toFixed(2)}`;

            // Crear el botón de eliminación
            const botonEliminar = document.createElement("button");
            botonEliminar.textContent = "x";
            botonEliminar.classList.add("btn-eliminar"); 
            botonEliminar.dataset.id = item.id;

            // Manejar el evento de clic en el botón de eliminación
            botonEliminar.addEventListener("click", (e) => {
                const idProducto = e.target.dataset.id;
                eliminarProductoDelCarrito(idProducto);
            });

            itemCarrito.appendChild(nombreProducto);
            itemCarrito.appendChild(precioTotal);
            itemCarrito.appendChild(botonEliminar);
            carritoContenido.appendChild(itemCarrito);

            total += totalItem;
        }
    });

    // Actualizar total en total-sin-descuento
    document.querySelector("#total-sin-descuento").innerText = `$${total.toFixed(2)}`;
    actualizarTotalCompra();
};

// Función para eliminar un producto del carrito
const eliminarProductoDelCarrito = (id) => {
    // Filtrar el carrito para eliminar el producto con el id especificado
    carrito = carrito.filter(item => item.id !== parseInt(id));

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Limpiar el contenido actual del carrito en la interfaz
    mostrarCarrito();
};

// Función para manejar la finalización de la compra
const finalizarCompra = () => {
    // Obtener el total final de la compra
    const totalCompra = parseFloat(document.querySelector("#total-sin-descuento").innerText.replace('$', '')) || 0;
    const descuentoEn = 100000;
    const descuentoPorcentaje = 0.30;
    let totalConDescuento;

    // Calcular el total con descuento si aplica
    if (totalCompra >= descuentoEn) {
        totalConDescuento = totalCompra * (1 - descuentoPorcentaje);
    } else {
        totalConDescuento = totalCompra;
    }

    // Vaciar el carrito en localStorage
    localStorage.removeItem('carrito');
    carrito = [];

    // Vaciar el contenido visual del carrito
    mostrarCarrito();

    // Actualizar totales en la interfaz
    document.querySelector("#total-sin-descuento").innerText = `$0.00`;
    document.querySelector("#total-con-descuento").innerText = `$0.00`;

    // Mostrar alerta con el valor con descuento
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: `¡Compra finalizada con éxito! Total con descuento: $${totalConDescuento.toFixed(2)}`,
        showConfirmButton: true,
    });
};

// Inicializar los productos al cargar la página
document.addEventListener('DOMContentLoaded', inicializarProductos);
