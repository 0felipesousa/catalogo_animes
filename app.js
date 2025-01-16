const containerAnimes = document.querySelector('#container_animes');
const buttonAnterior = document.querySelector('.pagina_anterior');
const buttonProximo = document.querySelector('.proxima_pagina');
const inputSearch = document.querySelector('.input-pesquisa');
const URL_ANIMES = 'https://kitsu.io/api/edge/anime';
const limit = 18; // Limite por requisição da API
const initialLoad = 54; // Carregamento inicial de animes
let currentPage = 0;
let offset = 0;
let isLoading = false;
let searchResults = [];

const fetchAnimes = async (pageOffset) => {
    const response = await fetch(`${URL_ANIMES}?page[limit]=${limit}&page[offset]=${pageOffset}`);
    if (response.ok) {
        const obj = await response.json();
        return obj.data;
    } else {
        console.error(`Erro ao buscar animes: ${response.status}`);
        return [];
    }
};

const fetchAnimesBySearch = async (searchTerm) => {
    const response = await fetch(`${URL_ANIMES}?filter[text]=${searchTerm}&page[limit]=${limit}`);
    if (response.ok) {
        const obj = await response.json();
        return obj.data;
    } else {
        console.error(`Erro ao buscar animes: ${response.status}`);
        return [];
    }
};

const mostrarAnime = async () => {
    if (isLoading) return;
    isLoading = true;
    let animes = [];

    if (searchResults.length > 0) {
        animes = searchResults.slice(offset, offset + limit);
    } else {
        animes = await fetchAnimes(offset);
    }

    if (animes.length > 0) {
        criarAnime(animes);
        offset += limit;
    } else {
        console.log('Nenhum anime encontrado.');
    }

    // Mostra o botão "Mostrar mais" após carregar os primeiros 54 animes
    if (offset >= initialLoad) {
        buttonProximo.style.display = 'block';
    }

    isLoading = false;
};

const criarAnime = (animes) => {
    animes.forEach(anime => {
        const titulo = anime.attributes.titles.en_jp?.toUpperCase() || 'Título indisponível';
        const posterImage = anime.attributes.posterImage?.large || '';
        const animeLista = document.createElement('div');
        animeLista.classList.add('anime_lista');
        
        const link = document.createElement('a');
        link.href = `informacoes.html?id=${anime.id}`;
        link.classList.add('link_anime');
        
        const animeImage = document.createElement('img');
        animeImage.src = posterImage;
        animeImage.classList.add('anime_image');
        
        // Título comentado conforme solicitado
        // const animeTitulo = document.createElement('figcaption');
        // animeTitulo.innerHTML = titulo;
        // animeTitulo.classList.add('anime_titulo');
        
        const animeinfo = document.createElement('div');
        animeinfo.innerHTML = titulo;
        animeinfo.classList.add('anime_info_mensage');
        animeinfo.style.display = 'none';

        const mostrarInfo = () => {
            animeinfo.style.display = 'block';
        };

        const ocultarInfo = () => {
            animeinfo.style.display = 'none';
        };

        animeImage.onmouseover = mostrarInfo;
        animeImage.onmouseout = ocultarInfo;
        
        link.appendChild(animeImage);
        // link.appendChild(animeTitulo); // Comentado conforme solicitado
        link.appendChild(animeinfo);
        animeLista.appendChild(link);
        containerAnimes.appendChild(animeLista);
    });
};

const filterAnimes = async () => {
    const searchTerm = inputSearch.value.trim();
    if (searchTerm) {
        searchResults = await fetchAnimesBySearch(searchTerm);
        if (searchResults.length > 0) {
            offset = 0;
            containerAnimes.innerHTML = '';
            mostrarAnime();
            buttonProximo.style.display = 'none';
        } else {
            containerAnimes.innerHTML = 'Nenhum anime encontrado para a busca.';
        }
    } else {
        searchResults = [];
        offset = 0;
        containerAnimes.innerHTML = '';
        mostrarAnime();
    }
};

// Evento de pesquisa ao pressionar Enter
inputSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        filterAnimes();
    }
});

// Remove o evento de input para evitar pesquisa automática
// inputSearch.addEventListener('input', filterAnimes);

// Botão de mostrar mais (anteriormente próxima página)
buttonProximo.addEventListener('click', async () => {
    await mostrarAnime();
});

// Carrega o primeiro lote de animes (54)
const loadInitialAnimes = async () => {
    for (let i = 0; i < 3; i++) {
        await mostrarAnime();
    }
};

loadInitialAnimes();