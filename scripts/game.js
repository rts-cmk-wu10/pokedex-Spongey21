const POKEMON = document.querySelector('.game__pokemon')
const POKEMONINFO = document.querySelector('.game__info')
const OPTIONLIST = document.querySelector('.game__options')

function randomNum(length) {
    return Math.floor(Math.random() * length)
}

function randomPokemon() {
    OPTIONLIST.innerHTML = ''

    for (let i = 0; i < 4; i++) {
        const BTN = document.createElement('button')
        BTN.className = 'game__option'

        OPTIONLIST.append(BTN)
    }

    const OPTIONS = document.querySelectorAll('.game__option')

    fetch(url + '?limit=100').then(res => res.json()).then(data => {

        // adds pokemon name to butons
        const choicePokemons = data.results.sort(() => 0.5 - Math.random());

        // picks winner pokemon
        const winner = choicePokemons[0]
        choicePokemons.shift()

        const winnerBTN = OPTIONS[randomNum(4)]

        OPTIONS.forEach((btn, index) => {
            if (btn == winnerBTN) {
                btn.textContent = winner.name

                btn.addEventListener('click', () => {
                    POKEMON.style.display = 'none'
                    POKEMONINFO.style.display = 'block'

                    setTimeout(() => {
                        randomPokemon()
                    }, 6000);
                })
            } else {
                btn.textContent = choicePokemons[index].name

                btn.addEventListener('click', () => {
                    btn.remove()
                })
            }
        })

        fetch(url + winner.name)
            .then(res => res.json())
            .then(pokemon => {
                POKEMON.src = pokemon.sprites.other.dream_world.front_default

                fetch(pokemon.species.url)
                    .then(speciesRes => speciesRes.json())
                    .then(speciesData => {
                        POKEMONINFO.textContent = speciesData.flavor_text_entries[6].flavor_text
                    })
        })
    })
}

randomPokemon()

