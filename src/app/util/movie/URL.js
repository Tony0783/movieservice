import axios from "axios";

// 모든 함수들을 객체로 묶어서 기본 내보내기
export default {
  async fetchFeaturedMovie(apiKey) {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR`);
      console.log(response.data.results[0]);
      return response.data.results[0];
    } catch (error) {
      console.error('Error fetching featured movie:', error);
      throw error;
    }
  },
  getURL4PopularMovies(apiKey, page = 1) {
    return `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=${page}`;
  },
  getURL4ReleaseMovies(apiKey, page = 2) {
    return `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=ko-KR&page=${page}`;
  },
  getURL4GenreMovies(apiKey, genre, page = 1) {
    return `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}&language=ko-KR&page=${page}`;
  }
};
