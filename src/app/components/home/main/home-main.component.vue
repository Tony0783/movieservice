<template>
  <div class="home">
    <!-- Banner 컴포넌트를 Vue 방식으로 사용 -->
    <Banner :movie="featuredMovie" />

    <!-- MovieRow 컴포넌트를 Vue 방식으로 사용 -->
    <MovieRow title="인기 영화" :fetchUrl="popularMoviesUrl" />
    <MovieRow title="최신 영화" :fetchUrl="newReleasesUrl" />
    <MovieRow title="액션 영화" :fetchUrl="actionMoviesUrl" />
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Banner from '../../../views/home-main/banner.component.vue';
import MovieRow from '../../../views/home-main/movie-row.component.vue';
import URLService from '../../../util/movie/URL.js';

export default {
  name: 'HomeMainComponent',
  components: {
    Banner,
    MovieRow,
  },
  setup() {
    // 상태 관리
    const apiKey = localStorage.getItem('TMDb-Key') || '';
    const featuredMovie = ref(null);
    const popularMoviesUrl = ref('');
    const newReleasesUrl = ref('');
    const actionMoviesUrl = ref('');

    // URL 서비스 설정
    popularMoviesUrl.value = URLService.getURL4PopularMovies(apiKey);
    newReleasesUrl.value = URLService.getURL4ReleaseMovies(apiKey);
    actionMoviesUrl.value = URLService.getURL4GenreMovies(apiKey, '28');

    // 특집 영화 불러오기
    const loadFeaturedMovie = async () => {
      featuredMovie.value = await URLService.fetchFeaturedMovie(apiKey);
    };

    // 스크롤 리스너 설정
    const scrollListener = () => {
      const header = document.querySelector('.app-header');
      if (window.scrollY > 50) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    };

    // 컴포넌트가 마운트될 때 실행
    onMounted(() => {
      loadFeaturedMovie();
      window.addEventListener('scroll', scrollListener);
    });

    // 컴포넌트가 언마운트되기 직전에 실행
    onBeforeUnmount(() => {
      window.removeEventListener('scroll', scrollListener);
    });

    return {
      featuredMovie,
      popularMoviesUrl,
      newReleasesUrl,
      actionMoviesUrl,
    };
  },
};
</script>

<style scoped>
.home {
  padding: 20px;
  text-align: center;
  background-color: #141414;
  color: white;
}

:host {
  display: block;
}

html,
body {
  overflow-y: scroll !important;
}

body {
  background-color: #141414 !important;
}
</style>
