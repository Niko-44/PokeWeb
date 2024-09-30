// URL de la API de Pokémon que vamos a usar, con un límite de 100 Pokémon
const url = 'https://pokeapi.co/api/v2/pokemon?limit=100';

// Variable para almacenar todos los Pokémon
let todosLosPokemon = [];

// Función principal para cargar el JSON desde la URL y mostrar los Pokémon
function cargarJSON(url) {
    // Hacemos una petición para obtener los datos de la URL
    fetch(url)
        .then(function (res) {
            return res.json(); // Transformamos la respuesta a formato JSON
        })
        .then(function (data) {
            let html = '';

            // Recorremos cada Pokémon de los resultados
            todosLosPokemon = data.results; // Guardamos todos los Pokémon para la búsqueda
            todosLosPokemon.forEach(function (pokemon) {
                // Hacemos otra petición para obtener los detalles de cada Pokémon individual
                fetch(pokemon.url)
                    .then(res => res.json()) // Convertimos la respuesta a JSON de nuevo
                    .then(pokemonData => {
                        html += crearCardHTML(pokemonData);
                        // Actualizamos el contenedor con todas las tarjetas de Pokémon
                        document.getElementById('pokemons-data').innerHTML = html;
                    })
                    .catch(error => console.log('Error al obtener datos del Pokémon:', error)); // Por si falla la petición de datos del Pokémon
            });
        })
        .catch(error => console.log('Error al cargar el JSON:', error));
}

// Función para crear el HTML de una tarjeta de Pokémon
function crearCardHTML(pokemonData) {
    // Verificamos si el Pokémon está guardado como favorito en localStorage
    const favorito = localStorage.getItem(pokemonData.name) === 'true';
    // Dependiendo si es favorito, le ponemos la imagen correspondiente del corazón
    const corazonSrc = favorito ? 'Images/corazon_lleno.png' : 'Images/corazon_vacio.png';

    return `
        <div class="pokemon-card" onclick="seleccionarPokemon('${pokemonData.name}')">
            <img id="corazon" src="${corazonSrc}" alt="favorito" onclick="favorito(this, '${pokemonData.name}', event)">
            <h2>${pokemonData.name}</h2>
            <img class="pokemon-img" src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
            <div class="tipo">
                <span class="${pokemonData.types[0].type.name}">${pokemonData.types[0].type.name}</span>
                ${pokemonData.types[1] ? `<span class="${pokemonData.types[1].type.name}">${pokemonData.types[1].type.name}</span>` : ''}
            </div>
        </div>
    `;
}

// Función para manejar los favoritos
function favorito(corazon, pokemonName, event) {
    event.stopPropagation(); // Evitamos que el clic en el corazón dispare el evento de la tarjeta completa

    if (corazon.src.includes('Images/corazon_vacio.png')) {
        corazon.src = 'Images/corazon_lleno.png';
        localStorage.setItem(pokemonName, true);
    } else {
        corazon.src = 'Images/corazon_vacio.png';
        localStorage.setItem(pokemonName, false);
    }
}

// Función para redirigir al detalle del Pokémon al hacer clic en su tarjeta
function seleccionarPokemon(pokemonName) {
    // Redirige a una nueva página con el nombre del Pokémon en los parámetros de la URL
    window.location.href = `pokemon.html?name=${pokemonName}`;
}

// Función para buscar Pokémon
function buscarPokemon() {
    const nombrePokemon = document.getElementById('barra_busqueda').value.toLowerCase(); // Obtener el valor de la barra de búsqueda y convertirlo a minúsculas
    const tipoPokemon = todosLosPokemon.filter(pokemon => pokemon.name.toLowerCase().includes(nombrePokemon));
    
    let html = '';
    
    // Obtener los detalles de cada Pokémon filtrado
    tipoPokemon.forEach(function (pokemon) {
        fetch(pokemon.url)
            .then(res => res.json())
            .then(pokemonData => {
                html += crearCardHTML(pokemonData);
                document.getElementById('pokemons-data').innerHTML = html;
            })
            .catch(error => console.log('Error al obtener datos del Pokémon:', error));
    });
}

// Función para filtrar Pokémon por tipo
function filtrarPorTipo() {
    const tipoSeleccionado = document.getElementById('filtro-tipo-pkm').value;
    let html = '';

    // Filtramos según el tipo seleccionado
    if (tipoSeleccionado === 'All') {
        // Si se selecciona "Todos", mostramos todos los Pokémon
        todosLosPokemon.forEach(function (pokemon) {
            fetch(pokemon.url)
                .then(res => res.json())
                .then(pokemonData => {
                    html += crearCardHTML(pokemonData);
                    document.getElementById('pokemons-data').innerHTML = html;
                })
                .catch(error => console.log('Error al obtener datos del Pokémon:', error));
        });
    } else {
        // Filtramos solo los Pokémon que tienen el tipo seleccionado
        todosLosPokemon.forEach(function (pokemon) {
            fetch(pokemon.url)
                .then(res => res.json())
                .then(pokemonData => {
                    // Comprobamos si el Pokémon tiene el tipo seleccionado
                    if (pokemonData.types.some(type => type.type.name === tipoSeleccionado.toLowerCase())) {
                        html += crearCardHTML(pokemonData);
                    }
                    // Actualizamos el contenedor con las tarjetas de Pokémon filtrados
                    document.getElementById('pokemons-data').innerHTML = html;
                })
                .catch(error => console.log('Error al obtener datos del Pokémon:', error));
        });
    }
}


// Agregar evento al botón de búsqueda
document.getElementById('buscar').addEventListener('click', buscarPokemon);
document.getElementById('filtro-tipo-pkm').addEventListener('change', filtrarPorTipo);

// Inicia la carga de los Pokémon cuando la página carga
cargarJSON(url);
