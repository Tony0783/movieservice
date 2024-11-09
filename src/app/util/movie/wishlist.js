// wishlistService.js
import { ref } from 'vue';

// 상태 관리 - wishlist를 저장할 ref 상태 변수
const wishlist = ref([]);

// 로컬 스토리지에서 위시리스트 로드
function loadWishlist() {
  const storedWishlist = localStorage.getItem('movieWishlist');
  if (storedWishlist) {
    wishlist.value = JSON.parse(storedWishlist);
  }
}

// 로컬 스토리지에 위시리스트 저장
function saveWishlist() {
  localStorage.setItem('movieWishlist', JSON.stringify(wishlist.value));
}

// 위시리스트에 영화 추가/제거
export function toggleWishlist(movie) {
  const index = wishlist.value.findIndex(item => item.id === movie.id);
  if (index === -1) {
    // 영화가 위시리스트에 없으면 추가
    wishlist.value.push(movie);
  } else {
    // 영화가 위시리스트에 있으면 제거
    wishlist.value = wishlist.value.filter(item => item.id !== movie.id);
  }
  saveWishlist();
}

// 특정 영화가 위시리스트에 있는지 확인
export function isInWishlist(movieId) {
  return wishlist.value.some(item => item.id === movieId);
}

// 현재 위시리스트를 가져오는 함수
export function getCurrentWishlist() {
  return wishlist.value;
}

// 위시리스트를 로드하는 함수 호출
loadWishlist();

// 위시리스트를 참조할 수 있는 ref를 export
export { wishlist };
