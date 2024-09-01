// Carga productos desde localStorage
function cargarProductosDesdeLocalStorage() {
    const productosJSON = localStorage.getItem('productos');
    console.log('Productos desde localStorage en carrito.js:', productosJSON); // Debugging
    if (productosJSON) {
        try {
            return JSON.parse(productosJSON);
        } catch (error) {
            console.error('Error al parsear los datos de productos:', error);
            return [];
        }
    }
    return [];
}

// Actualiza el contenido del carrito
function actualizarCarrito() {
    const carritoContenido = document.getElementById('carrito-contenido');
    const totalCarritoElemento = document.getElementById('total-carrito');

    carritoContenido.innerHTML = ''; // Limpiar contenido previo

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const productos = cargarProductosDesdeLocalStorage();
    console.log('Productos en carrito.js:', productos); // Debugging

    let totalCarrito = 0;

    if (carrito.length === 0) {
        carritoContenido.innerHTML = '<p>El carrito está vacío.</p>';
        totalCarritoElemento.textContent = '0.00';
        return;
    }

    carrito.forEach(item => {
        const producto = productos.find(p => p.nombre === item.nombre);
        if (producto) {
            const totalProducto = item.cantidad * producto.precio;
            totalCarrito += totalProducto;

            const productoElemento = document.createElement('div');
            productoElemento.classList.add('d-flex', 'justify-content-between', 'mb-2');
            productoElemento.innerHTML = `
                <div>
                    <strong>${producto.nombre}</strong> (Cantidad: ${item.cantidad})
                </div>
                <div>
                    $${totalProducto.toFixed(2)}
                </div>
            `;
            carritoContenido.appendChild(productoElemento);
        }
    });

    totalCarritoElemento.textContent = totalCarrito.toFixed(2);
}

// Maneja la finalización de la compra
function finalizarCompra() {
    const totalCompra = document.getElementById('total-carrito').textContent;

    Swal.fire({
        title: '¡Compra realizada!',
        text: `El total de tu compra es $${totalCompra}`,
        icon: 'success',
        confirmButtonText: 'Aceptar'
    }).then(() => {
        // Limpiar el carrito y actualizar la vista
        localStorage.removeItem('carrito');
        actualizarCarrito(); // Actualiza el carrito en la interfaz
    });
}

// Inicializa el carrito al cargar la página
document.addEventListener('DOMContentLoaded', actualizarCarrito);
