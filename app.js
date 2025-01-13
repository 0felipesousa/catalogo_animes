const containerAnimes = document.querySelector('#container_animes');
const buttonAnterior = document.querySelector('.pagina_anterior');
const buttonProximo = document.querySelector('.proxima_pagina');
const inputSearch = document.querySelector('.input-pesquisa');
const URL_ANIMES = 'https://kitsu.io/api/edge/anime';
let currentPage = 0;
const limit = 18;
let isLoading = false;
const maxAnimes = 52; // Limite de animes a serem exibidos
let totalLoadedAnimes = 0; // Contador de animes carregados

const fetchAnimes = async (page) => {
    try {
        const response = await fetch(`${URL_ANIMES}?page[limit]=${limit}&page[offset]=${page * limit}`);
        if (response.status === 200) {
            const obj = await response.json();
            return obj;
        }
    } catch (e) {
        console.error(e);
    }
    return null;
};

const mostrarAnime = async () => {
    if (isLoading || totalLoadedAnimes >= maxAnimes) return;
    isLoading = true;
    const dataAnimes = await fetchAnimes(currentPage);
    if (dataAnimes) {
        const allAnimes = dataAnimes.data;
        criarAnime(allAnimes);
        totalLoadedAnimes += allAnimes.length;
        currentPage++;
    } else {
        console.log('Nenhum anime encontrado.');
    }
    isLoading = false;
};

const criarAnime = (animes) => {
    animes.forEach(anime => {
        if (totalLoadedAnimes >= maxAnimes) return;
        const titulo = anime.attributes.titles.en_jp.toUpperCase();
        const posterImage = anime.attributes.posterImage.large;

        const animeLista = document.createElement('div');
        animeLista.classList.add('anime_lista');

        const link = document.createElement('a');
        link.href = `informacoes.html?id=${anime.id}`;
        link.classList.add('link_anime');

        const animeImage = document.createElement('img');
        animeImage.src = posterImage;
        animeImage.classList.add('anime_image');

        const animeTitulo = document.createElement('figcaption');
        animeTitulo.innerHTML = titulo;
        animeTitulo.classList.add('anime_titulo');

        link.appendChild(animeImage);
        link.appendChild(animeTitulo);
        animeLista.appendChild(link);
        containerAnimes.appendChild(animeLista);
    });
};

const onScroll = () => {
    if (totalLoadedAnimes >= maxAnimes || isLoading) return;
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 300) { // Ajuste para carregar antes de atingir o final
        mostrarAnime();
    }
};

window.addEventListener('scroll', onScroll);
window.addEventListener('resize', onScroll); // Para tratar redimensionamentos

const filterAnimes = async () => {
    const searchTerm = inputSearch.value.toUpperCase();
    if (searchTerm) {
        const dataAnimes = await fetchAnimesBySearch(searchTerm);
        if (dataAnimes && dataAnimes.data) {
            containerAnimes.innerHTML = ''; // Limpa os animes anteriores
            criarAnime(dataAnimes.data);
        } else {
            containerAnimes.innerHTML = 'Nenhum anime encontrado para a busca.';
        }
    } else {
        currentPage = 0;
        totalLoadedAnimes = 0;
        containerAnimes.innerHTML = '';
        mostrarAnime();
    }
};

inputSearch.addEventListener('input', filterAnimes);

mostrarAnime();
