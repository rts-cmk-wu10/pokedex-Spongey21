const INFO = document.querySelector('.pokedex__info')
const FORWARD = document.querySelector('.pokedex__forward')
const BACK = document.querySelector('.pokedex__back')
const LOADER = document.querySelector('.pokedex__pokeball')
const SEARCH = document.querySelector('.pokedex__searchInput')
const AUTOCOMPLETE = document.querySelector('.pokedex__autocomplete')

const URL = new URLSearchParams(window.location.search)
const OFFSET = Number(URL.get("offset")) || 0

const url = 'https://pokeapi.co/api/v2/pokemon/'

// searched pokemon
function fetchPokemon(pokemon) {
    fetch(url + pokemon)
        .then(res => {
            if (!res.ok) { throw new Error('404: haha') }
            return res.json()
        })
        .then(data => {
            INFO.innerHTML = `
                    <h1 class="pokedex__name">${data.name}</h1>
                    <div class="pokedex__lazyload">
                        <svg class="pokedex__placeholder" width="400" height="250" fill="black">
                            <rect width="100%" height="100%" fill="lightgray" stroke="gray" stroke-width="10"/>
                            <polygon points="150 100, 300 300, 20 250" fill="gray"/>
                            <polygon points="300 150, 380 250, 180 300" fill="gray"/>
                            <circle cx="300" cy="50" r="20" fill="gray" />
                        </svg>
                    </div>
                    <ul class="pokedex__types">${data.types.map(element => `<li class="pokedex__typeName">${element.type.name}</li>`).join('')}</ul>
                    `
            const IMG = new Image()
            IMG.src = data.sprites.other.dream_world.front_default
            IMG.className = 'pokedex__picture'
            const DIV = document.querySelector('.pokedex__lazyload')

            IMG.onload = () => {
                DIV.innerHTML = ''
                DIV.append(IMG)
            }

            FORWARD.style.display = 'none'
            BACK.style.display = 'none'
        }).catch(error => {
            window.location.href = '/ups.html'
        })
}

// displays pokemon list
function fetchPokemonList(offset) {
    fetch(url + `?offset=${offset}`)
        .then(res => {
            if (!res.ok) { throw new Error('404: not found') }
            return res.json()
        })
        .then(data => {
            const LAST_OFFSET = data.count - (data.count % 20)

            FORWARD.href = `/?offset=${OFFSET >= LAST_OFFSET ? LAST_OFFSET : OFFSET + 20}`

            BACK.href = `/?offset=${Math.max(OFFSET - 20, 0)}`

            INFO.innerHTML = `
                    <ul class="pokedex__list"></ul>
                `
            const LIST = INFO.querySelector('.pokedex__list')

            data.results.forEach(pokemon => {
                LIST.innerHTML += `<li><a href="?pokemon-name=${pokemon.name}" class="pokedex__item">${pokemon.name}</li>`
            })
        }).catch(error => {
            console.log(error);
            //window.location.href = '/ups.html'
        })
}

// looks for autocompletion of pokemon names
function searchPokemon() {
    fetch(url + '?limit=1000')
        .then(res => {
            if (!res.ok) { throw new Error('404: not found') }
            return res.json()
        })
        .then(data => {
            data.results.forEach(pokemon => {
                AUTOCOMPLETE.innerHTML += `
                        <option>${pokemon.name}</option>
                    `
            });
        }).catch(error => {
            window.location.href = '/ups.html'
        })
}

// init code
if (URL.has('pokemon-name')) {
    LOADER.style.display = 'flex'
    fetchPokemon(URL.get('pokemon-name'))
    LOADER.style.display = 'none'
} else {
    LOADER.style.display = 'flex'
    fetchPokemonList(URL.get('offset'), URL)
    LOADER.style.display = 'none'
}


SEARCH.addEventListener('focus', () => {
    searchPokemon()
})