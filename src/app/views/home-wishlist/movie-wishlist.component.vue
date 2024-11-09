<template>
    <div class="movie-grid" ref="gridContainer">
      <div :class="['grid-container', currentView]">
        <div 
          v-for="(movieGroup, index) in visibleWishlistMovies" 
          :key="index" 
          class="movie-row" 
          :class="{ 'full': movieGroup.length === rowSize }"
        >
          <div 
            v-for="movie in movieGroup" 
            :key="movie.id" 
            class="movie-card" 
            @click="toggleWishlist(movie)"
          >
            <img :src="getImageUrl(movie.poster_path)" :alt="movie.title">
            <div class="movie-title">{{ movie.title }}</div>
            <div class="wishlist-indicator">👍</div>
          </div>
        </div>
      </div>
      <div v-if="wishlistMovies.length === 0" class="empty-wishlist">
        위시리스트가 비어 있습니다.
      </div>
      <div class="pagination" v-if="totalPages > 1">
        <button @click="prevPage" :disabled="currentPage === 1">&lt; 이전</button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">다음 &gt;</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, onUnmounted, watchEffect } from 'vue';
  import { wishlist } from '../../services/wishlistService'; // Wishlist 서비스 import
  import ResizeObserver from 'resize-observer-polyfill';
  
  export default {
    name: 'MovieWishlist',
    setup() {
      const gridContainer = ref(null);
      const rowSize = ref(4);
      const moviesPerPage = ref(20);
      const currentPage = ref(1);
      const isMobile = ref(window.innerWidth <= 768);
      const currentView = ref('grid');
      const wishlistMovies = ref([]);
      const visibleWishlistMovies = ref([]);
      
      // ResizeObserver를 이용하여 레이아웃 계산
      let resizeObserver;
      
      const loadWishlist = () => {
        wishlistMovies.value = wishlist.value;
        updateVisibleMovies();
      };
      
      const calculateLayout = () => {
        if (gridContainer.value) {
          const containerWidth = gridContainer.value.offsetWidth;
          const containerHeight = window.innerHeight - gridContainer.value.offsetTop;
          const movieCardWidth = isMobile.value ? 90 : 220;
          const movieCardHeight = isMobile.value ? 150 : 330;
          const horizontalGap = isMobile.value ? 10 : 15;
          const verticalGap = -10;
  
          rowSize.value = Math.floor(containerWidth / (movieCardWidth + horizontalGap));
          const maxRows = Math.floor(containerHeight / (movieCardHeight + verticalGap));
          moviesPerPage.value = rowSize.value * maxRows;
  
          updateVisibleMovies();
        }
      };
  
      const updateVisibleMovies = () => {
        const startIndex = (currentPage.value - 1) * moviesPerPage.value;
        const endIndex = startIndex + moviesPerPage.value;
        const paginatedMovies = wishlistMovies.value.slice(startIndex, endIndex);
  
        visibleWishlistMovies.value = paginatedMovies.reduce((resultArray, item, index) => {
          const groupIndex = Math.floor(index / rowSize.value);
          if (!resultArray[groupIndex]) {
            resultArray[groupIndex] = [];
          }
          resultArray[groupIndex].push(item);
          return resultArray;
        }, []);
      };
  
      const nextPage = () => {
        if (currentPage.value < totalPages.value) {
          currentPage.value++;
          updateVisibleMovies();
        }
      };
  
      const prevPage = () => {
        if (currentPage.value > 1) {
          currentPage.value--;
          updateVisibleMovies();
        }
      };
  
      const handleResize = () => {
        isMobile.value = window.innerWidth <= 768;
        calculateLayout();
      };
  
      const toggleWishlist = (movie) => {
        wishlist.value.includes(movie)
          ? wishlist.value = wishlist.value.filter(m => m.id !== movie.id)
          : wishlist.value.push(movie);
        loadWishlist();
      };
  
      const getImageUrl = (path) => {
        return path ? `https://image.tmdb.org/t/p/w300${path}` : '/placeholder-image.jpg';
      };
  
      const totalPages = ref(0);
      watchEffect(() => {
        totalPages.value = Math.ceil(wishlistMovies.value.length / moviesPerPage.value);
      });
  
      onMounted(() => {
        loadWishlist();
        handleResize();
        window.addEventListener('resize', handleResize);
        resizeObserver = new ResizeObserver(() => calculateLayout());
        if (gridContainer.value) {
          resizeObserver.observe(gridContainer.value);
        }
      });
  
      onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
        if (gridContainer.value) {
          resizeObserver.unobserve(gridContainer.value);
        }
        resizeObserver.disconnect();
      });
  
      return {
        gridContainer,
        rowSize,
        moviesPerPage,
        currentPage,
        isMobile,
        currentView,
        wishlistMovies,
        visibleWishlistMovies,
        totalPages,
        nextPage,
        prevPage,
        handleResize,
        toggleWishlist,
        getImageUrl
      };
    }
  };
  </script>
  
  <style scoped>
  /* 기존 CSS를 그대로 사용 */
  .wishlist-indicator {
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 20px;
    background-color: rgba(229, 9, 20, 0.5);
    box-shadow: 0 0 5px rgba(229, 9, 20, 0.7);
  }
  
  .movie-grid {
    width: 100%;
    height: calc(100vh - 200px);
    margin-bottom: 40px;
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .grid-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .movie-row {
    display: flex;
    justify-content: center;
    margin: 0 auto 20px;
    width: 100%;
  }
  
  .grid-container.list .movie-row {
    flex-direction: column;
  }
  
  .movie-card {
    width: 160px;
    margin: 0 10px;
    transition: transform 0.3s;
    position: relative;
  }
  
  .grid-container.list .movie-card {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .movie-card:hover {
    transform: scale(1.05);
  }
  
  .movie-card img {
    width: 100%;
    border-radius: 4px;
    object-fit: cover;
  }
  
  .grid-container.list .movie-card img {
    width: 100px;
    margin-right: 20px;
  }
  
  .movie-title {
    margin-top: 5px;
    text-align: center;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .grid-container.list .movie-title {
    text-align: left;
    white-space: normal;
  }
  
  .empty-wishlist {
    text-align: center;
    font-size: 18px;
    margin-top: 20px;
    color: #666;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }
  
  .pagination button {
    background-color: #333;
    color: white;
    border: none;
    padding: 10px 15px;
    margin: 0 10px;
    cursor: pointer;
    border-radius: 4px;
  }
  
  .pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    .movie-grid {
      width: 100%;
      height: calc(90svh - 200px);
      margin-bottom: 40px;
      margin-top: 30px;
    }
  
    .movie-card {
      width: 90px;
      margin: 0 5px;
    }
  
    .movie-title {
      font-size: 12px;
    }
  
    .pagination button {
      padding: 8px 12px;
      font-size: 14px;
    }
  
    .grid-container.list .movie-card img {
      width: 60px;
    }
  }
  </style>
  