document.addEventListener('DOMContentLoaded', () => {
    console.log("El script.js se ha cargado correctamente.");

    // --- Funcionalidad del Carrito ---
    // Un arreglo para almacenar los productos en el carrito
    let carrito = JSON.parse(localStorage.getItem('carritoEcovida')) || [];

    // Función para guardar el carrito en localStorage
    function guardarCarrito() {
        localStorage.setItem('carritoEcovida', JSON.stringify(carrito));
        actualizarContadorCarrito();
    }

    // Función para actualizar el contador del carrito en el header/nav
    function actualizarContadorCarrito() {
        const contadorElement = document.getElementById('contador-carrito');
        if (contadorElement) {
            const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
            contadorElement.textContent = totalItems > 0 ? `(${totalItems})` : '';
            // Si quieres mostrar un icono de carrito o un número más prominente
            // puedes manipularlo aquí.
        }
    }

    // Función para añadir un producto al carrito
    window.agregarAlCarrito = (id, nombre, precio, imagen) => { // Hacemos global para poder llamarla desde el HTML
        const productoExistente = carrito.find(item => item.id === id);
        if (productoExistente) {
            productoExistente.cantidad++;
        } else {
            carrito.push({ id, nombre, precio, imagen, cantidad: 1 });
        }
        guardarCarrito();
        alert(`${nombre} ha sido añadido al carrito.`); // Mensaje simple
        mostrarCarrito(); // Para actualizar la vista del carrito
    };

    // Función para mostrar los productos en el carrito (lo veremos en una sección específica)
    function mostrarCarrito() {
        const carritoContainer = document.getElementById('items-carrito');
        const carritoTotalElement = document.getElementById('total-carrito');

        if (!carritoContainer || !carritoTotalElement) return; // Salir si no estamos en la página del carrito

        carritoContainer.innerHTML = ''; // Limpiar el contenido anterior

        let totalGeneral = 0;

        if (carrito.length === 0) {
            carritoContainer.innerHTML = '<p>El carrito está vacío.</p>';
        } else {
            carrito.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('carrito-item');
                itemDiv.innerHTML = `
                    <img src="${item.imagen}" alt="${item.nombre}" class="carrito-item-img">
                    <div class="carrito-item-info">
                        <h4>${item.nombre}</h4>
                        <p>Precio unitario: $${item.precio.toFixed(2)}</p>
                        <div class="cantidad-controls">
                            <button onclick="cambiarCantidad(${item.id}, -1)">-</button>
                            <span>${item.cantidad}</span>
                            <button onclick="cambiarCantidad(${item.id}, 1)">+</button>
                        </div>
                        <p>Subtotal: $${(item.precio * item.cantidad).toFixed(2)}</p>
                        <button class="eliminar-item" onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
                    </div>
                `;
                carritoContainer.appendChild(itemDiv);
                totalGeneral += item.precio * item.cantidad;
            });
        }
        carritoTotalElement.textContent = totalGeneral.toFixed(2);
    }

    // Función para cambiar la cantidad de un producto en el carrito
    window.cambiarCantidad = (id, cambio) => { // Hacemos global
        const producto = carrito.find(item => item.id === id);
        if (producto) {
            producto.cantidad += cambio;
            if (producto.cantidad <= 0) {
                carrito = carrito.filter(item => item.id !== id); // Eliminar si la cantidad es 0 o menos
            }
            guardarCarrito();
            mostrarCarrito();
        }
    };

    // Función para eliminar un producto del carrito
    window.eliminarDelCarrito = (id) => { // Hacemos global
        carrito = carrito.filter(item => item.id !== id);
        guardarCarrito();
        mostrarCarrito();
    };


    // --- Fetch API para Productos ---
    async function cargarProductos() {
        const productosContainer = document.getElementById('productos-api-container');
        if (!productosContainer) return; // Solo ejecutar si estamos en la página de productos

        productosContainer.innerHTML = 'Cargando productos...';

        try {
            // Usaremos una API REST pública para ejemplos de productos
            // Por ejemplo, JSONPlaceholder para simular o Fake Store API
            // Aquí un ejemplo usando Fake Store API:
            const response = await fetch('https://fakestoreapi.com/products?limit=6'); // Obtener 6 productos de ejemplo
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            productosContainer.innerHTML = ''; // Limpiar el mensaje de carga

            data.forEach(producto => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card-flex'); // Reutilizamos tu clase de Flexbox
                productCard.innerHTML = `
                    <img src="${producto.image}" alt="${producto.title}">
                    <h3>${producto.title}</h3>
                    <p>${producto.description.substring(0, 100)}...</p>
                    <span class="price">$${producto.price.toFixed(2)}</span>
                    <button onclick="agregarAlCarrito(${producto.id}, '${producto.title.replace(/'/g, "\\'")}', ${producto.price}, '${producto.image}')">Añadir al Carrito</button>
                `;
                productosContainer.appendChild(productCard);
            });
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            productosContainer.innerHTML = '<p>No se pudieron cargar los productos. Por favor, inténtelo de nuevo más tarde.</p>';
        }
    }

    // --- Validación de Formulario (Contacto) ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');

            let isValid = true;

            // Validar Nombre
            if (nameInput.value.trim() === '') {
                alert('Por favor, ingresa tu nombre.');
                nameInput.focus();
                isValid = false;
            }

            // Validar Email
            if (isValid && !/\S+@\S+\.\S+/.test(emailInput.value)) {
                alert('Por favor, ingresa un correo electrónico válido.');
                emailInput.focus();
                isValid = false;
            }

            // Validar Mensaje
            if (isValid && messageInput.value.trim() === '') {
                alert('Por favor, ingresa tu mensaje.');
                messageInput.focus();
                isValid = false;
            }

            if (!isValid) {
                event.preventDefault(); // Detener el envío del formulario si hay errores
            } else {
                alert('Formulario enviado con éxito. ¡Gracias por contactarnos!'); // Mensaje al usuario
            }
        });
    }

    // --- Inicialización ---
    actualizarContadorCarrito(); // Asegurarse de que el contador se actualice al cargar cualquier página
    if (document.getElementById('productos-api-container')) {
        cargarProductos(); // Cargar productos solo si estamos en la página de productos
    }
    if (document.getElementById('items-carrito')) {
        mostrarCarrito(); // Mostrar carrito solo si estamos en la sección del carrito (que aún no creamos)
    }

}); // Fin de DOMContentLoaded