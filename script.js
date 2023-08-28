const API_KEY = "8279cf5a";

// Get movies by title when submit search form
const formSearch = document.querySelector("#form-search");
const inputSearch = document.querySelector("#keyword");

formSearch.addEventListener("submit", async function (e) {
  e.preventDefault();

  try {
    const movies = await getMovieData(inputSearch.value);
    updateMovieUI(movies);
  } catch (err) {
    showError(err);
  }
});

// Get detail movie by imdb ID
document.addEventListener("click", async function (e) {
  if (e.target.classList.contains("lihat-detail")) {
    const movie = await getDetailMovieData(e.target.dataset.imdb);
    updateDetailMovieModal(movie);
  }
});

function getMovieData(keyword) {
  return fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${keyword}`)
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Terjadi kesalahan terhadap sistem!");
      }

      return response.json();
    })
    .then((movies) => {
      if (movies.Response == "False") {
        throw new Error(movies.Error);
      }

      return movies.Search;
    });
}

function getMovieCards(movie) {
  return `<div class="col-lg-4 mb-3">
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
}

function updateMovieUI(movies) {
  const movieList = document.querySelector("#movie-list");
  const errorMessage = document.querySelector(".error-message");

  errorMessage.innerHTML = "";

  let elements = "";
  movies.forEach((movie) => {
    elements += getMovieCards(movie);
  });

  movieList.innerHTML = elements;
}

function getDetailMovieData(imdb) {
  return fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdb}`)
    .then((response) => response.json())
    .then((movie) => movie);
}

function updateDetailMovieModal(movie) {
  const modal = document.querySelector(".modal-dialog");

  let rating = "";
  movie.Ratings.forEach((rate) => {
    rating += `<li>${rate.Source}: ${rate.Value}</li>`;
  });

  modal.innerHTML = `<div class="modal-content">
    <div class="modal-header">
      <h1 class="modal-title fs-5" id="judul">${movie.Title}</h1>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close"
      ></button>
    </div>
    <div class="modal-body">
      <div class="row">
        <div class="col-md-4">
          <img src="${movie.Poster}" alt="" class="img-fluid" id="detail-film-poster">
        </div>
        <div class="col-md-8">
          <div class="row">
            <div class="col-12">
              <p>Genre: <span class="genre fst-italic">${movie.Genre}</span></p>
            </div>
            <div class="col-12">
              <p>Tanggal Rilis: <span class="tanggal-rilis fst-italic">${movie.Released}</span></p>
            </div>
            <div class="col-12">
              <p>Durasi Film: <span class="durasi-film fst-italic">${movie.Runtime}</span></p>
            </div>
            <div class="col-12">
              <p>Sutradara: <span class="sutradara fst-italic">${movie.Director}</span></p>
            </div>
            <div class="col-12">
              <p>Penulis: <span class="penulis fst-italic">${movie.Writer}</span></p>
            </div>
            <div class="col-12">
              <p>Pemeran: <span class="pemeran fst-italic">${movie.Actors}</span></p>
            </div>
            <div class="col-12">
              <p>Ratings: <ul class="list-unstyled ratings">${rating}</ul></p>
            </div>
            <div class="col-12">
              <p class="plot">${movie.Plot}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function showError(error) {
  const el = `<div class="row">
        <div class="col-6">
          <div class="alert alert-danger alert-dismissible fade show"
            role="alert">
            <strong>${error}</strong>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>`;

  const errorMessage = document.querySelector(".error-message");

  errorMessage.innerHTML = el;
}
