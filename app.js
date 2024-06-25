const containerAnimes = document.querySelector('#container_animes');
const buttonAnterior = document.querySelector('.pagina_anterior');
const buttonProximo = document.querySelector('.proxima_pagina');
const inputSearch = document.querySelector('.input-pesquisa')
const URL_ANIMES = 'https://kitsu.io/api/edge/anime';
let currentPage = 0;
const limit = 18;

const fetchAnimes = async (page) => {
    const response = await fetch(`${URL_ANIMES}?page[limit]=${limit}&page[offset]=${page * limit}`);
    if (response.status === 200) {
        const obj = await response.json();
        console.log(obj);
        return obj;
    }
};

const fetchAnimesBySearch = async (searchTerm) => {
    const response = await fetch(`${URL_ANIMES}?filter[text]=${searchTerm}&page[limit]=${limit}`);
    if (response.status === 200) {
        const obj = await response.json();
        console.log(obj);
        return obj;
    } else {
        console.error('Erro ao buscar animes:', response.status);
        return null;
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
    containerAnimes.innerHTML = ''; // Limpa o container antes de adicionar novos animes
    animes.forEach(anime => {
        const titulo = anime.attributes.slug.toUpperCase();
        const posterImage = anime.attributes.posterImage.large;

        const animeLista = document.createElement('div');
        animeLista.classList.add('anime_lista');

        const animeInfo = document.createElement('a');
        animeInfo.classList.add('anime_info');
        animeInfo.href = 'informacoesAnimes.html';

        const animeImage = document.createElement('img');
        animeImage.src = posterImage;
        animeImage.classList.add('anime_image');

        const animeTitulo = document.createElement('figcaption');
        animeTitulo.innerHTML = titulo;
        animeTitulo.classList.add('anime_titulo');

        animeLista.appendChild(animeInfo);
        animeInfo.appendChild(animeImage);
        animeLista.appendChild(animeTitulo);
        containerAnimes.appendChild(animeLista);
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
        criarAnime(allAnimes); // Mostra todos os animes se não houver termo de busca
    }
    if(searchTerm === ""){
        currentPage = 0
        mostrarAnime()
    }
};

inputSearch.addEventListener('input', filterAnimes);

// Event Listeners para os botões
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
