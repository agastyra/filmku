const API_KEY = "8279cf5a";

function getAllMovies(ajax) {
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

getAllMovies({
  url: `http://www.omdbapi.com/?apikey=${API_KEY}&s=avengers`,
  success: (result) => {
    const movies = result.Search;
    const movieList = document.querySelector("#movie-list");

    movies.forEach((movie) => {
      let el = `<div class="card">
            <img src="${movie.Poster}" class="card-img-top" />
            <div class="card-body">
              <h5 class="card-title mb-4">${movie.Title}</h5>
              <h6 class="card-subtitle mb-2 text-body-secondary">Tahun rilis: ${movie.Year}</h6>
              <h6 class="card-subtitle mb-4 text-body-secondary">Tipe: ${movie.Type}</h6>
              <a href="#" class="btn btn-primary">Lihat Detail</a>
            </div>
          </div>`;

      let html = document.createElement("div");
      html.classList.add("col-lg-4");
      html.classList.add("mb-3");
      html.innerHTML = el;

      movieList.appendChild(html);
    });
  },
  error: (e) => console.error(e),
});
