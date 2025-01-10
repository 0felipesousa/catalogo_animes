const containerAnimes = document.querySelector('#container_animes');
const buttonAnterior = document.querySelector('.pagina_anterior');
const buttonProximo = document.querySelector('.proxima_pagina');
const inputSearch = document.querySelector('.input-pesquisa')
const URL_ANIMES = 'https://kitsu.io/api/edge/anime';
let currentPage = 0;
const limit = 20;

const fetchAnimes = async (page) => {
    const response = await fetch(`${URL_ANIMES}?page[limit]=${limit}&page[offset]=${page * limit}`);
    try {
        if (response.status === 200) {
            const obj = await response.json();
            console.log(obj);
            return obj;
        }
    } catch (e){
        console.error(e)
    } 
};

const fetchAnimesBySearch = async (searchTerm) => {
    const response = await fetch(`${URL_ANIMES}?filter[text]=${searchTerm}&page[limit]=${limit}`);
    try {
        if (response.status === 200) {
            const obj = await response.json();
            console.log(obj);
            return obj;
        } else {
            console.error('Erro ao buscar animes:', response.status);
            return null;
        }
    } catch (e) {
        console.error(e)
    }
};

const mostrarAnime = async () => {
    const dataAnimes = await fetchAnimes(currentPage);
    if (dataAnimes) {
        allAnimes = dataAnimes.data;
        criarAnime(allAnimes)
    } else {
        containerAnimes.innerHTML = 'Animes não encontrados';
    }
}

const criarAnime =  (animes) => {
    containerAnimes.innerHTML = '';
    const totalItems = animes.length;
    const itemsNeeded = limit - totalItems;
    animes.forEach(anime => {
        const titulo = anime.attributes.titles.en_jp.toUpperCase();
        const posterImage = anime.attributes.posterImage.large;
        
        const animeLista = document.createElement('div');
        animeLista.classList.add('anime_lista');
        const link = document.createElement('a')
        link.href = `informacoes.html?id=${anime.id}`
        link.classList.add('link_anime')

        const animeImage = document.createElement('img');
        animeImage.src = posterImage;
        animeImage.classList.add('anime_image');

        const animeTitulo = document.createElement('figcaption');
        animeTitulo.innerHTML = titulo;
        animeTitulo.classList.add('anime_titulo');

        link.appendChild(animeImage)
        link.appendChild(animeTitulo)
        //animeLista.appendChild(animeImage);
        animeLista.appendChild(link);
        containerAnimes.appendChild(animeLista);
    });
    for (let i = 0; i < itemsNeeded; i++) {
        const placeholder = document.createElement('div');
        placeholder.classList.add('anime_lista', 'anime_lista_placeholder');
        containerAnimes.appendChild(placeholder);
    }
    ajustarTitulos()
};

const ajustarTitulos = () => {
    const titulos = document.querySelectorAll('.anime_titulo');
    titulos.forEach(titulo => {
        titulo.style.fontSize = '0.8rem'; // Exemplo de tamanho ajustado
        titulo.style.color = 'black'; // Exemplo de cor
    });
};

const filterAnimes = async () => {
    const searchTerm = inputSearch.value.toUpperCase();
    if (searchTerm) {
        const dataAnimes = await fetchAnimesBySearch(searchTerm);
        if (dataAnimes && dataAnimes.data) {
            criarAnime(dataAnimes.data);
        } else {
            containerAnimes.innerHTML = 'Nenhum anime encontrado para a busca.';
        }
    } else {
        criarAnime(allAnimes); 
    }
    if(searchTerm === ""){
        currentPage = 0
        mostrarAnime()
    }
};

inputSearch.addEventListener('keypress', (e) => {
    if (e.key === 13) {
        filterAnimes()
    }
})

inputSearch.addEventListener('input', filterAnimes);

buttonAnterior.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        mostrarAnime();
    }
});

buttonProximo.addEventListener('click', () => {
    currentPage++;
    mostrarAnime();
});

mostrarAnime();
