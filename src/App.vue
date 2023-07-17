<script setup>
  import Header from './components/Header.vue';
  import ToTop from './components/ToTop.vue';
</script>

<template>
  <Header></Header>
  <div class="container">
    <router-view></router-view>
    <ToTop></ToTop>
  </div>
</template>