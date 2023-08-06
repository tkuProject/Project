<script setup>
  import { onBeforeMount } from 'vue';
  import { useCardStore } from './store/cardStore';
  import { useUserStore } from './store/userStore';
  import Header from './components/Header.vue';
  import ToTop from './components/ToTop.vue';

  const cardStore = useCardStore();
  const userStore = useUserStore();
  
  onBeforeMount(() => {
    // 確認是否已有登入
    const account = localStorage.getItem('account');
    if(account) {
      userStore.account = account;
      userStore.collectionCards = collectionCards;
    }
    // 請求所有卡片
    cardStore.getCards();
  });

</script>

<template>
  <Header></Header>
  <div class="container">
    <router-view></router-view>
    <ToTop></ToTop>
  </div>
</template>