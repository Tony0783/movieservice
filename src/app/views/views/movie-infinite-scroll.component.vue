<template>
    <div class="movie-grid" ref="gridContainer">
      <div :class="['grid-container', currentView]">
        <div
          v-for="(movieGroup, index) in visibleMovieGroups"
          :key="index"
          :class="['movie-row', { 'full': movieGroup.length === rowSize }]"
        >
          <div
            v-for="movie in movieGroup"
            :key="movie.id"
            class="movie-card"
            @mouseup="toggleWishlist(movie)"
          >
            <img
              :src="getImageUrl(movie.poster_path)"
              :alt="movie.title"
              loading="lazy"
            />
            <div class="movie-title">{{ movie.title }}</div>
            <div v-if="isInWishlist(movie.id)" class="wishlist-indicator">👍</div>
          </div>
        </div>
      </div>
  
      <div ref="loadingTrigger" class="loading-trigger">
        <div v-if="isLoading" class="loading-indicator">
          <div class="spinner"></div>
          <span>Loading...</span>
        </div>
      </div>
  
      <button v-if="showTopButton" @click="scrollToTopAndReset" class="top-button" aria-label="맨 위로 이동">
        Top
      </button>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
  import axios from 'axios';
  import { useWishlist } from '../../util/movie/wishlist';
  
  export default {
    name: 'MovieInfiniteScroll',
    props: {
      genreCode: String,
      apiKey: String,
      sortingOrder: { type: String, default: 'all' },
      voteAverage: { type: Number, default: 100 }
    },
    setup(props) {
      const movies = ref([]);
      const currentPage = ref(1);
      const rowSize = ref(4);
      const isLoading = ref(false);
      const isMobile = ref(window.innerWidth <= 768);
      const currentView = ref('grid');
      const hasMore = ref(true);
      const showTopButton = ref(false);
      const wishlistService = useWishlist();
      const gridContainer = ref(null);
      const loadingTrigger = ref(null);
  
      // Intersection Observer 설정
      const observer = ref(null);
      const setupIntersectionObserver = () => {
        observer.value = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && !isLoading.value && hasMore.value) {
            fetchMovies();
          }
        }, { rootMargin: '100px', threshold: 0.1 });
  
        if (loadingTrigger.value) {
          observer.value.observe(loadingTrigger.value);
        }
      };
  
      // API에서 영화 목록을 가져오는 함수
      const fetchMovies = async () => {
        if (isLoading.value || !hasMore.value) return;
  
        isLoading.value = true;
        try {
          const url = props.genreCode === '0'
            ? 'https://api.themoviedb.org/3/movie/popular'
            : 'https://api.themoviedb.org/3/discover/movie';
  
          const response = await axios.get(url, {
            params: {
              api_key: props.apiKey,
              language: 'ko-KR',
              page: currentPage.value
            }
          });
          const newMovies = response.data.results;
  
          if (newMovies.length > 0) {
            let movieArray = [...movies.value, ...newMovies];
  
            if (props.sortingOrder !== 'all') {
              movieArray = movieArray.filter(
                (movie) => movie.original_language === props.sortingOrder
              );
            }
  
            movieArray = movieArray.filter((movie) => {
              if (props.voteAverage === -1) return true;
              if (props.voteAverage === -2) return movie.vote_average <= 4;
              return movie.vote_average >= props.voteAverage && movie.vote_average < props.voteAverage + 1;
            });
  
            movies.value = movieArray;
            currentPage.value++;
          } else {
            hasMore.value = false;
          }
        } catch (error) {
          console.error('Error fetching movies:', error);
        } finally {
          isLoading.value = false;
        }
      };
  
      // 영화 포스터 URL 생성
      const getImageUrl = (path) => {
        return path ? `https://image.tmdb.org/t/p/w300${path}` : '/placeholder-image.jpg';
      };
  
      // 현재 페이지에 표시할 영화 그룹 계산
      const visibleMovieGroups = computed(() => {
        return movies.value.reduce((resultArray, item, index) => {
          const groupIndex = Math.floor(index / rowSize.value);
          if (!resultArray[groupIndex]) {
            resultArray[groupIndex] = [];
          }
          resultArray[groupIndex].push(item);
          return resultArray;
        }, []);
      });
  
      // 모바일 크기에 따른 레이아웃 설정
      const handleResize = () => {
        isMobile.value = window.innerWidth <= 768;
        calculateLayout();
      };
  
      const calculateLayout = () => {
        if (gridContainer.value) {
          const containerWidth = gridContainer.value.offsetWidth;
          const movieCardWidth = isMobile.value ? 100 : 300;
          const horizontalGap = isMobile.value ? 10 : 15;
          rowSize.value = Math.floor(containerWidth / (movieCardWidth + horizontalGap));
        }
      };
  
      // 스크롤 위치에 따라 상단 이동 버튼 표시
      const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        showTopButton.value = scrollTop > 300;
      };
  
      // 영화 위시리스트에 추가/제거
      const toggleWishlist = (movie) => {
        wishlistService.toggleWishlist(movie);
      };
  
      // 영화가 위시리스트에 있는지 확인
      const isInWishlist = (movieId) => wishlistService.isInWishlist(movieId);
  
      // 맨 위로 이동 후 영화 목록 초기화
      const scrollToTopAndReset = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        resetMovies();
      };
  
      // 영화 목록 초기화
      const resetMovies = () => {
        movies.value = [];
        currentPage.value = 1;
        hasMore.value = true;
        fetchMovies();
      };
  
      // 초기 설정
      onMounted(() => {
        setupIntersectionObserver();
        fetchMovies();
        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);
      });
  
      // 컴포넌트 언마운트 시 이벤트 정리
      onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
        if (observer.value) observer.value.disconnect();
      });
  
      return {
        movies,
        currentPage,
        rowSize,
        isLoading,
        isMobile,
        currentView,
        hasMore,
        showTopButton,
        gridContainer,
        loadingTrigger,
        visibleMovieGroups,
        fetchMovies,
        getImageUrl,
        toggleWishlist,
        isInWishlist,
        scrollToTopAndReset
      };
    }
  };
  </script>
  
  <style scoped>
  .movie-grid {
    width: 100%;
    margin-bottom: 40px;
    margin-top: 30px;
    display: flex;
    flex-direction: column;
  }
  .grid-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  /* 추가 스타일 */
  </style>
  