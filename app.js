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
let loadedAfterButton = 0; // Contador para animes carregados após o botão aparecer

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

const mostrarAnime = async (isButtonClick = false) => {
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

        // Se for um clique no botão, incrementa o contador
        if (isButtonClick) {
            loadedAfterButton += limit;
            // Se atingir 54 animes carregados pelo botão, oculta o botão
            if (loadedAfterButton >= 54) {
                buttonProximo.style.display = 'none';
                loadedAfterButton = 0; // Reseta o contador
            }
        } 
        // Mostra o botão apenas quando atingir o carregamento inicial via scroll
        else if (offset === initialLoad) {
            buttonProximo.style.display = 'block';
        }
    } else {
        console.log('Nenhum anime encontrado.');
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
            loadedAfterButton = 0;
            containerAnimes.innerHTML = '';
            mostrarAnime();
            buttonProximo.style.display = 'none';
        } else {
            containerAnimes.innerHTML = 'Nenhum anime encontrado para a busca.';
        }
    } else {
        searchResults = [];
        offset = 0;
        loadedAfterButton = 0;
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

// Botão de mostrar mais (carrega próximos 18 animes)
buttonProximo.addEventListener('click', async () => {
    await mostrarAnime(true);
});

// Função para carregar mais animes ao rolar o scroll
const handleScroll = () => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const bottomPosition = document.documentElement.scrollHeight;
    
    // Verifica se está próximo ao final da página e se não atingiu o limite inicial
    if (scrollPosition >= bottomPosition - 100 && offset < initialLoad) {
        mostrarAnime();
    }
};

// Evento de scroll
window.addEventListener('scroll', handleScroll);

// Carrega o primeiro lote de animes
mostrarAnime();