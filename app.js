const containerAnimes = document.querySelector('#container_animes');
const buttonAnterior = document.querySelector('.pagina_anterior');
const buttonProximo = document.querySelector('.proxima_pagina');
const inputSearch = document.querySelector('.input-pesquisa');
const URL_ANIMES = 'https://kitsu.io/api/edge/anime';
const limit = 18; // Limite por requisição da API
const totalAnimes = 54; // Total de animes a serem carregados (18 * 3 páginas)
let currentPage = 0; // Página lógica atual
let offset = 0; // Controle do deslocamento na API
let isLoading = false;
let searchResults = []; // Armazenar os resultados da pesquisa

const fetchAnimes = async (pageOffset) => {
    const response = await fetch(`${URL_ANIMES}?page[limit]=${limit}&page[offset]=${pageOffset}`);
    if (response.ok) {
        const obj = await response.json();
        return obj.data; // Retorna apenas os dados dos animes
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
    if (isLoading || offset >= totalAnimes) return; // Não carrega mais animes se já atingiu o total
    isLoading = true;

    let animes = [];

    // Se houver uma pesquisa em andamento, use os resultados da pesquisa
    if (searchResults.length > 0) {
        animes = searchResults.slice(offset, offset + limit); // Carrega a próxima parte da pesquisa
    } else {
        animes = await fetchAnimes(offset); // Caso contrário, carrega os animes normais
    }

    if (animes.length > 0) {
        criarAnime(animes);
        offset += limit; // Atualiza o deslocamento para o próximo lote
    } else {
        console.log('Nenhum anime encontrado.');
    }

    // Verifica se todos os animes foram carregados e oculta o botão "Próxima página"
    if (offset < totalAnimes) {
        buttonProximo.style.display = 'none'; // Oculta o botão "Próxima página"
    } else {
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

        const animeTitulo = document.createElement('figcaption');
        animeTitulo.innerHTML = titulo;
        animeTitulo.classList.add('anime_titulo');

        link.appendChild(animeImage);
        link.appendChild(animeTitulo);
        animeLista.appendChild(link);
        containerAnimes.appendChild(animeLista);
    });
};

// Função de busca
const filterAnimes = async () => {
    const searchTerm = inputSearch.value.trim();
    if (searchTerm) {
        searchResults = await fetchAnimesBySearch(searchTerm);
        if (searchResults.length > 0) {
            offset = 0; // Resetar o offset ao buscar
            containerAnimes.innerHTML = ''; // Limpar a lista de animes
            mostrarAnime(); // Carregar os resultados da pesquisa
            buttonProximo.style.display = 'none'; // Esconde o botão "Próxima página" se houver pesquisa
        } else {
            containerAnimes.innerHTML = 'Nenhum anime encontrado para a busca.';
        }
    } else {
        // Caso o campo de busca esteja vazio, carregar todos os animes
        searchResults = []; // Limpar resultados da pesquisa
        offset = 0;
        containerAnimes.innerHTML = ''; // Limpar a lista
        mostrarAnime(); // Carregar os animes padrão
        buttonProximo.style.display = 'block'; // Exibe o botão de próxima página
    }
};

inputSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        filterAnimes();
    }
});

inputSearch.addEventListener('input', filterAnimes);

// Botão de próxima página
buttonProximo.addEventListener('click', async () => {
    if (offset < totalAnimes) {
        await mostrarAnime();
    }
});

// Botão de página anterior
buttonAnterior.addEventListener('click', async () => {
    if (currentPage > 0) {
        currentPage--;
        offset = currentPage * limit; // Recalcula o deslocamento
        await mostrarAnime();
    }
});

// Função para carregar mais animes ao rolar o scroll
const handleScroll = () => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const bottomPosition = document.documentElement.scrollHeight;

    if (scrollPosition >= bottomPosition - 100) { // Se o usuário chegou perto do final da página
        mostrarAnime(); // Carrega mais animes
    }
};

// Evento de scroll
window.addEventListener('scroll', handleScroll);

// Inicializa com o primeiro lote de animes
mostrarAnime();
