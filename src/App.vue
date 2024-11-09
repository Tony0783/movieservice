<template>
  <div id="app">
    <!-- HomeMain 컴포넌트를 렌더링 -->
    <HomeMain />
  </div>
</template>

<script>
// 홈 컴포넌트를 올바르게 가져오기 위한 import 구문
import HomeMain from './app/components/home/main/home-main.component.vue';


export default {
  name: 'App',
  components: {
    HomeMain
  }
};
</script>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: #141414;
}
#app {
  text-align: center;
}
</style>
