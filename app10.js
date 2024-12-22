document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const resultsContainer = document.querySelector("#results");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        try {
            const resultado = await fetchData();
            if (resultado && resultado.results) {
                const rating = document.querySelector("#rating").value; // Obtenemos la valoración seleccionada
                const filteredMovies = filterMoviesByRating(resultado.results, rating); // Filtramos las películas por valoración

                resultsContainer.innerHTML = ""; // Limpiamos el contenedor

                // Iteramos sobre las películas filtradas
                filteredMovies.forEach((movie) => {
                    const movieElement = document.createElement("div");

                    // Imagen de la película
                    const movieImage = document.createElement("img");
                    movieImage.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                    movieImage.alt = movie.title;

                    // Título de la película
                    const movieTitle = document.createElement("h3");
                    movieTitle.textContent = movie.title;

                    // Voto promedio de la película
                    const movieVote = document.createElement("p");
                    movieVote.textContent = `Voto promedio: ${movie.vote_average}`;

                    // Reseña de la película
                    const movieOverview = document.createElement("p");
                    movieOverview.textContent = movie.overview || "Reseña no disponible.";

                    // Agregamos los elementos al contenedor
                    movieElement.appendChild(movieImage);
                    movieElement.appendChild(movieTitle);
                    movieElement.appendChild(movieVote);
                    movieElement.appendChild(movieOverview);
                    resultsContainer.appendChild(movieElement);
                });
            } else {
                resultsContainer.textContent = "No se encontraron resultados.";
            }
        } catch (error) {
            resultsContainer.textContent = `Error al buscar datos: ${error.message}`;
        }
    });

    async function fetchData() {
        try {
            const page = document.querySelector("#page").value;
            const account_id = "dfee1fbecf46635322b08d180ac62586";
            const url = `https://api.themoviedb.org/3/movie/popular?api_key=${account_id}&page=${page}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // Filtra las películas según la valoración seleccionada
    function filterMoviesByRating(movies, rating) {
        const ranges = {
            mala: { min: 0, max: 4 },
            regular: { min: 4, max: 6 },
            buena: { min: 6, max: 8 },
            muybuena: { min: 8, max: 10 }
        };

        const { min, max } = ranges[rating];
        return movies.filter(movie => movie.vote_average >= min && movie.vote_average < max);
    }
});






