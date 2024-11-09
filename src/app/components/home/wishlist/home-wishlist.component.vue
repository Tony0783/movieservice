<template>
  <!-- MovieWishlistComponent를 Vue에서 사용 -->
  <MovieWishlist />
</template>

<script>
// 필요한 컴포넌트 가져오기
import MovieWishlist from '../../../views/home-wishlist/movie-wishlist.component.vue';

export default {
  name: 'HomeWishlistComponent',
  components: {
    MovieWishlist
  }
};
</script>

<style scoped>
/* home-wishlist.component.css의 스타일을 여기에 추가하면 됩니다. */
/* 예: 
  .wishlist-class {
    color: red;
  }
*/
</style>
