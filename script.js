const API_KEY = "8279cf5a";

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
    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${txtKeyword.value}`)
      .then((response) => response.json())
      .then((result) => {
        const movies = result.Search ?? [];
        const movieList = document.querySelector("#movie-list");
        let el = "";

        if (movies.length != 0) {
          movies.forEach((movie) => {
            el += getMovieCard(movie);
          });
        } else {
          el = `<p class="text-muted">Film atau series tidak ditemukan.</p>`;
        }

        movieList.innerHTML = el;

        // Get Movie By imdbID
        const btn_lihat_detail = document.querySelectorAll(".lihat-detail");

        btn_lihat_detail.forEach((btn) => {
          btn.addEventListener("click", function () {
            fetch(
              `https://www.omdbapi.com/?apikey=${API_KEY}&i=${this.dataset.imdb}`
            )
              .then((response) => response.json())
              .then((movie) => {
                getDetailMovieModal(movie);
              })
              .catch((e) => console.error(e));
          });
        });
      })
      .catch((e) => console.error(e));
  }
});

function getMovieCard(movie) {
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

function getDetailMovieModal(movie) {
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
