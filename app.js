const containerAnimes = document.querySelector('#container_animes');
const buttonAnterior = document.querySelector('.pagina_anterior');
const buttonProximo = document.querySelector('.proxima_pagina');
const inputSearch = document.querySelector('.input-pesquisa');
const URL_ANIMES = 'https://kitsu.io/api/edge/anime';
const limit = 18; // Limite por requisição da API
const maxAnimesPerPage = 52; // Total de animes por "página lógica"
let currentPage = 0; // Página lógica atual
let offset = 0; // Controle do deslocamento na API
let isLoading = false;

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

const fetchMultipleBatches = async (startOffset, totalAnimes) => {
    let animes = [];
    let fetchedCount = 0;

    while (fetchedCount < totalAnimes) {
        const batch = await fetchAnimes(startOffset + fetchedCount);
        if (!batch || batch.length === 0) break; // Sai do loop se não houver mais animes
        animes = animes.concat(batch);
        fetchedCount += batch.length;
    }

    return animes.slice(0, totalAnimes); // Garante que não excede o número necessário
};

const mostrarAnime = async () => {
    if (isLoading) return;
    isLoading = true;
    const animes = await fetchMultipleBatches(offset, maxAnimesPerPage);
    if (animes.length > 0) {
        criarAnime(animes);
    } else {
        console.log('Nenhum anime encontrado.');
    }
    isLoading = false;
};

const criarAnime = (animes) => {
    containerAnimes.innerHTML = ''; // Limpa o container antes de exibir novos animes
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
    //ajustarTitulos();
};

//const ajustarTitulos = () => {
    //const titulos = document.querySelectorAll('.anime_titulo');
    //titulos.forEach(titulo => {
        //titulo.style.fontSize = '0.8rem';
        //titulo.style.color = 'black';
    //});
//};

// Botão de próxima página
buttonProximo.addEventListener('click', async () => {
    currentPage++;
    offset = currentPage * maxAnimesPerPage; // Atualiza o deslocamento
    await mostrarAnime();
});

// Botão de página anterior
buttonAnterior.addEventListener('click', async () => {
    if (currentPage > 0) {
        currentPage--;
        offset = currentPage * maxAnimesPerPage; // Recalcula o deslocamento
        await mostrarAnime();
    }
});

// Busca de animes
const filterAnimes = async () => {
    const searchTerm = inputSearch.value.trim();
    if (searchTerm) {
        const dataAnimes = await fetchAnimesBySearch(searchTerm);
        if (dataAnimes && dataAnimes.length > 0) {
            criarAnime(dataAnimes);
        } else {
            containerAnimes.innerHTML = 'Nenhum anime encontrado para a busca.';
        }
    } else {
        currentPage = 0;
        offset = 0;
        await mostrarAnime();
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

inputSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        filterAnimes();
    }
});

inputSearch.addEventListener('input', filterAnimes);

mostrarAnime(); // Inicializa com a primeira página
