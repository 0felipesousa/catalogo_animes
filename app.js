const containerAnimes = document.querySelector('#container_animes');
const buttonAnterior = document.querySelector('.pagina_anterior');
const buttonProximo = document.querySelector('.proxima_pagina');
const inputSearch = document.querySelector('.input-pesquisa')
const URL_ANIMES = 'https://kitsu.io/api/edge/anime';
let currentPage = 0;
const limit = 18;
let isLoading = false;
const maxAnimes = 52; // Limite de animes a serem exibidos
let totalLoadedAnimes = 0; // Contador de animes carregados

const fetchAnimes = async (page) => {
    const response = await fetch(`${URL_ANIMES}?page[limit]=${limit}&page[offset]=${page * limit}`);
    try {
        if (response.status === 200) {
            const obj = await response.json();
            console.log(obj);
            return obj;
        }
    } catch (e) {
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
    if (isLoading || totalLoadedAnimes >= maxAnimes) return; // Para se atingir o limite
    isLoading = true;
    const dataAnimes = await fetchAnimes(currentPage);
    if (dataAnimes) {
        const allAnimes = dataAnimes.data;
        criarAnime(allAnimes);
        totalLoadedAnimes += allAnimes.length; // Incrementa o total de animes carregados
        currentPage++; // Incrementa a página para o próximo carregamento
    } else {
        console.log('Nenhum anime encontrado.');
    }
    isLoading = false;
};

const criarAnime = (animes) => {
    animes.forEach(anime => {
        if (totalLoadedAnimes >= maxAnimes) return; // Verifica novamente para evitar excesso
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
    ajustarTitulos();
};

const ajustarTitulos = () => {
    const titulos = document.querySelectorAll('.anime_titulo');
    titulos.forEach(titulo => {
        titulo.style.fontSize = '0.8rem'; // Exemplo de tamanho ajustado
        titulo.style.color = 'black'; // Exemplo de cor
    });
};

const onScroll = () => {
    if (totalLoadedAnimes >= maxAnimes) return; // Interrompe o scroll se atingir o limite
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100) { // Quando o usuário chegar perto do final
        mostrarAnime();
    }
};

window.addEventListener('scroll', onScroll);

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
    if(searchTerm === "") {
        currentPage = 0;
        mostrarAnime();
    }
};

inputSearch.addEventListener('keypress', (e) => {
    if (e.key === 13) {
        filterAnimes();
    }
});

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
