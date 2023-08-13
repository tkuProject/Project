<script setup>
  import { onBeforeMount } from 'vue';
  import { useCardStore } from './store/cardStore';
  import { useUserStore } from './store/userStore';
  import Header from './components/Header.vue';
  import ToTop from './components/ToTop.vue';

  const cardStore = useCardStore();
  const userStore = useUserStore();
  
  onBeforeMount(async () => {
    // 確認是否已有登入
    const account = localStorage.getItem('account');
    if(account) {
      userStore.account = account;
    }
    // 請求所有卡片
    await cardStore.getCards();
    // 把收藏拿過來
    await userStore.getCollectionCards();
  });

</script>

<template>
  <Header></Header>
  <div class="container">
    <Suspense>
      <router-view></router-view>
    </Suspense>
    <ToTop></ToTop>
  </div>
</template>