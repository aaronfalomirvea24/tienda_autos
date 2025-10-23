// script.js

// --- 1. Constantes y Variables Globales ---

// Referencias a elementos del DOM
const listaAutosDOM = document.getElementById('lista-autos');
const sinResultadosDOM = document.getElementById('sin-resultados');
const contadorResultadosDOM = document.getElementById('contador-resultados');

// Elementos de filtro (usando los IDs que asignamos)
const inputBusqueda = document.getElementById('busqueda');
const inputMinPrecio = document.getElementById('min-precio');
const inputMaxPrecio = document.getElementById('max-precio');
// Referencias a los botones mediante su nuevo ID
const botonBusqueda = document.getElementById('btn-buscar'); 
const botonFiltroPrecio = document.getElementById('btn-filtrar-precio'); 
const rangoMinDOM = document.getElementById('rango-min');
const rangoMaxDOM = document.getElementById('rango-max');


// Inicializar la lista de todas las tarjetas (Nodos del DOM)
// Convierte la NodeList a un Array real para usar .filter()
const todasLasTarjetas = Array.from(listaAutosDOM.querySelectorAll('.tarjeta-auto'));

// --- 2. Lógica de Filtrado Principal ---

/**
 * Función principal que aplica todos los filtros y actualiza la interfaz.
 */
function aplicarFiltros() {
    // 1. Obtener valores de los filtros
    const query = inputBusqueda.value.toLowerCase().trim();
    // Usamos parseFloat para obtener el valor numérico, o Infinity/0 como default.
    const minPrecio = parseFloat(inputMinPrecio.value) || 0;
    const maxPrecio = parseFloat(inputMaxPrecio.value) || Infinity;

    // 2. Aplicar filtro a todas las tarjetas usando el método Array.prototype.filter()
    const autosFiltrados = todasLasTarjetas.filter(tarjeta => {
        // Obtener datos relevantes de la tarjeta (de los data-attributes y el h3)
        const marca = tarjeta.getAttribute('data-marca').toLowerCase();
        const modelo = tarjeta.getAttribute('data-modelo') ? tarjeta.getAttribute('data-modelo').toLowerCase() : '';
        const precio = parseFloat(tarjeta.getAttribute('data-precio'));

        // a) Filtro de Búsqueda por Marca/Modelo
        // Busca si la query está contenida en la marca O en el modelo.
        const cumpleBusqueda = (query === '') || marca.includes(query) || modelo.includes(query);

        // b) Filtro por Rango de Precios
        const cumplePrecio = precio >= minPrecio && precio <= maxPrecio;

        // El auto debe cumplir ambos criterios (AND lógico)
        return cumpleBusqueda && cumplePrecio;
    });

    // 3. Actualizar el DOM (Mostrar/Ocultar y Contadores)
    actualizarResultados(autosFiltrados);
}

/**
 * Oculta y muestra las tarjetas según el resultado del filtro y actualiza el contador.
 * @param {Array} listaAutosFiltrada - Array de elementos DOM filtrados.
 */
function actualizarResultados(listaAutosFiltrada) {
    const totalResultados = listaAutosFiltrada.length;

    // Actualizar el contador
    contadorResultadosDOM.textContent = totalResultados;

    // 1. Mostrar/Ocultar las tarjetas
    todasLasTarjetas.forEach(tarjeta => {
        // Verifica si la tarjeta actual está incluida en el array filtrado.
        const debeMostrar = listaAutosFiltrada.includes(tarjeta);
        
        tarjeta.style.display = debeMostrar ? 'flex' : 'none'; 
    });

    // 2. Mostrar mensaje de "Sin Resultados"
    if (totalResultados === 0) {
        sinResultadosDOM.style.display = 'block';
    } else {
        sinResultadosDOM.style.display = 'none';
    }
}


// --- 3. Event Listeners (Activadores) ---

// 1. Activar el filtro principal al hacer clic en los botones
botonBusqueda.addEventListener('click', aplicarFiltros);
botonFiltroPrecio.addEventListener('click', aplicarFiltros);

// Opcional: Activar filtro al presionar Enter en el campo de búsqueda
inputBusqueda.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        aplicarFiltros();
    }
});

// 2. Actualizar el rango de precio visualmente al cambiar los inputs (sin filtrar aún)
inputMinPrecio.addEventListener('input', () => {
    // Usamos una RegEx sencilla para formatear el número con comas (para miles)
    rangoMinDOM.textContent = inputMinPrecio.value.replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
});

inputMaxPrecio.addEventListener('input', () => {
    rangoMaxDOM.textContent = inputMaxPrecio.value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});

// Inicializar la vista al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Asegurarse de que el rango de precio visual se actualice al cargar
    rangoMinDOM.textContent = inputMinPrecio.value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    rangoMaxDOM.textContent = inputMaxPrecio.value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    // Aplicar los filtros iniciales (muestra todos los autos)
    aplicarFiltros(); 
});