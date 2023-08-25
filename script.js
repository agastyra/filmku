const API_KEY = "8279cf5a";

function getMovies(ajax) {
  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        ajax.success(JSON.parse(xhr.response));
      } else if (xhr.status === 404) {
        ajax.error(xhr.responseText);
      }
    }
  };

  xhr.open("get", ajax.url, true);
  xhr.send();
}

// Get Movies by Title
const txtKeyword = document.querySelector("#keyword");
const formSearch = document.querySelector("#form-search");

formSearch.addEventListener("submit", (e) => {
  e.preventDefault();

  if (
    txtKeyword.value == "" ||
    txtKeyword.value == undefined ||
    txtKeyword.value == null
  ) {
    return false;
  } else {
    getMovies({
      url: `https://www.omdbapi.com/?apikey=${API_KEY}&s=${txtKeyword.value}`,
      success: (result) => {
        const movies = result.Search ?? [];
        const movieList = document.querySelector("#movie-list");
        let el = "";

        if (movies.length != 0) {
          movies.forEach((movie) => {
            el += `<div class="col-lg-4 mb-3">
            <div class="card">
                <img src="${movie.Poster}" class="card-img-top" />
                <div class="card-body">
                  <h5 class="card-title mb-4">${movie.Title}</h5>
                  <h6 class="card-subtitle mb-2 text-body-secondary">Tahun rilis: ${movie.Year}</h6>
                  <h6 class="card-subtitle mb-4 text-body-secondary">Tipe: ${movie.Type}</h6>
                  <button
                    type="button"
                    class="btn btn-primary lihat-detail"
                    data-bs-toggle="modal"
                    data-bs-target="#detail-film"
                    data-imdb="${movie.imdbID}"
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
          </div>`;
          });
        } else {
          el = `<p class="text-muted">Film atau series tidak ditemukan.</p>`;
        }

        movieList.innerHTML = el;

        // Get Movie By imdbID
        const btn_lihat_detail = document.querySelectorAll(".lihat-detail");

        btn_lihat_detail.forEach((btn) => {
          btn.addEventListener("click", function () {
            const modalFilm = document.querySelector("#detail-film");

            const poster = modalFilm.querySelector("#detail-film-poster");
            const judul = modalFilm.querySelector("#judul");
            const plot = modalFilm.querySelector(".plot");
            const genre = modalFilm.querySelector(".genre");
            const tanggal_rilis = modalFilm.querySelector(".tanggal-rilis");
            const durasi_film = modalFilm.querySelector(".durasi-film");
            const sutradara = modalFilm.querySelector(".sutradara");
            const penulis = modalFilm.querySelector(".penulis");
            const pemeran = modalFilm.querySelector(".pemeran");
            const ratings = modalFilm.querySelector(".ratings");

            getMovies({
              url: `https://www.omdbapi.com/?apikey=${API_KEY}&i=${this.dataset.imdb}`,
              success: (movie) => {
                poster.src = movie.Poster;
                judul.textContent = movie.Title;
                plot.textContent = movie.Plot;
                genre.textContent = movie.Genre;
                tanggal_rilis.textContent = movie.Released;
                durasi_film.textContent = movie.Runtime;
                sutradara.textContent = movie.Director;
                penulis.textContent = movie.Writer;
                pemeran.textContent = movie.Actors;

                let el = "";
                movie.Ratings.forEach((rate) => {
                  el += `<li>${rate.Source}: ${rate.Value}</li>`;
                });

                ratings.innerHTML = el;
              },
              error: (e) => console.error(e),
            });
          });
        });
      },
      error: (e) => console.error(e),
    });
  }
});
