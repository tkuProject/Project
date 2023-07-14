<script setup>
  import Header from './components/Header.vue'
</script>

<template>
  <Header></Header>
  <div class="container">
    <router-view></router-view>
  </div>
  <a class="toTop"><span>回頂端</span></a>
</template>

<style lang="less">
  .toTop {
    display: block;
    position: fixed;
    right: 100px;
    bottom: 80px;
    width: 42px;
    height: 42px;
    background: white url('./assets/images/toTop.svg') no-repeat center 9px;
    background-size: 70%;
    border: 2px solid gray;
    border-radius: 50%;
    cursor: pointer;
    &:hover {
      background-image: url('./assets/images/toTopHover.svg');
      border-color: #009DBF;
    }
    span {
      display: inline-block;
      position: absolute;
      top: 50px;
      left: -3px;
      width: 48px;
      color: gray;
      text-align: center;
      &:hover {
        color: #009DBF;
      }
    }
  }
</style>