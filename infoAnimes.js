async function fetchAnimesInfo() {
    const urlParametros = new URLSearchParams(window.location.search);
    const animeId = urlParametros.get('id');

    try {
        if (!animeId) {
            document.body.innerHTML = '<p>ID do anime não fornecido.<p/>';
            return;
        }

        const response = await fetch(`https://kitsu.io/api/edge/anime/${animeId}`);
        const data = await response.json();

        document.querySelector("#button-voltar").addEventListener("click", function () {
            history.back();
        });

        if (data) {
            const anime = data.data.attributes;
            document.getElementById('title').textContent = anime.titles.en || anime.titles.en_jp;
            document.getElementById('sinopse').textContent = anime.synopsis;
            document.getElementById('poster').src = anime.posterImage.medium;
            document.querySelector('.lancamento').textContent = `Lançamento: ${anime.startDate}`;
            document.querySelector('.idade').textContent = anime.ageRatingGuide || 'N/A';
            document.querySelector('.numero_episodes').textContent = `Episódios: ${anime.episodeLength || 'N/A'}`;
            const trailerLink = document.querySelector('#trailer_link');
            trailerLink.href = `https://www.youtube.com/watch?v=${anime.youtubeVideoId}`;
        }
    } catch (e) {
        console.error(e);
    }
}

document.addEventListener('DOMContentLoaded', fetchAnimesInfo);
