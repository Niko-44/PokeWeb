// Obtenemos los parámetros de la URL para saber qué Pokémon mostrar
const urlParams = new URLSearchParams(window.location.search);
const pokemonName = urlParams.get('name'); // Sacamos el nombre del Pokémon

// Construimos la URL de la API para obtener información del Pokémon específico
const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;

// Función para cargar los datos del Pokémon desde la API
function cargarJSON(url) {
    fetch(url) // Hacemos una petición para obtener los datos
    .then(res => res.json()) // Convertimos la respuesta a JSON
    .then(pokemonData => {
        const html = `
            <div class="pokemon-detail-card">
                <h2>${pokemonData.name}</h2>
                <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
                <p>Altura: ${pokemonData.height}</p>
                <p>Peso: ${pokemonData.weight}</p>
                <p>Experiencia base: ${pokemonData.base_experience}</p>
                
                <div class="tipo">
                    <span class="${pokemonData.types[0].type.name}">${pokemonData.types[0].type.name}</span>
                    ${pokemonData.types[1] ? `<span class="${pokemonData.types[1].type.name}">${pokemonData.types[1].type.name}</span>` : ''}
                </div>
                
                <h3>Habilidades</h3>
                <ul>
                    ${pokemonData.abilities.map(ability => `<li>${ability.ability.name}</li>`).join('')}
                </ul>
            </div>
        `;

        // Actualizamos el contenedor con la información del Pokémon
        document.getElementById('pokemon-detalles').innerHTML = html;
    })
    .catch(error => console.log('Error al obtener detalles del Pokémon:', error));
}

// Llamamos a la función para cargar los datos del Pokémon
cargarJSON(url);