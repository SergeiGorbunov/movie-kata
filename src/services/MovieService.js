export default class MovieService {
  _baseUrl = 'https://api.themoviedb.org/3';
  _apiKey = '6e76ca5c8a65a7d0a7fded1c134bbd3f';

  async getMoviesByKeyword(keyword, page) {
    const res = await fetch(this._baseUrl + `/search/movie?api_key=${this._apiKey}&query=${keyword}&page=${page}`, {
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error('Ошибка при выполнении запроса');
    }

    return await res.json();
  }

  async createGuestSession() {
    const res = await fetch(this._baseUrl + `/authentication/guest_session/new?api_key=${this._apiKey}`, {
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error('Ошибка при получении гостевого токена');
    }

    return await res.json();
  }

  async getRatedMovies(guestSessionId) {
    const res = await fetch(this._baseUrl + `/guest_session/${guestSessionId}/rated/movies?api_key=${this._apiKey}`, {
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error('Ошибка при получении оцененных фильмах');
    }

    return await res.json();
  }

  async addRating(movieId, guestSessionId, rating) {
    const res = await fetch(
      this._baseUrl + `/movie/${movieId}/rating?api_key=${this._apiKey}&guest_session_id=${guestSessionId}`,
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ value: rating }),
      }
    );

    if (!res.ok) {
      throw new Error('Ошибка при добавлении рейтинга');
    }
  }

  async getGenres() {
    const res = await fetch(this._baseUrl + `/genre/movie/list?api_key=${this._apiKey}&language=en-US`, {
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error('Ошибка при получении жанров');
    }

    return await res.json();
  }
}
