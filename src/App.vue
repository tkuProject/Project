<script setup>
  import { onBeforeMount } from 'vue';
  import { useUserStore } from './store/userStore';
  import Header from './components/Header.vue';
  import ToTop from './components/ToTop.vue';

  const userStore = useUserStore();
  onBeforeMount(() => {
    const account = localStorage.getItem('account');
    if(account) {
      userStore.account = account;
    }
  });

</script>

<template>
  <Header></Header>
  <div class="container">
    <router-view></router-view>
    <ToTop></ToTop>
  </div>
</template>