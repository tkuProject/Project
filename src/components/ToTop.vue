<script setup>

    const toTop = () => {
        window.scrollTo(0, 0);
    };

</script>

<template>
    <button @click="toTop" class="toTop"><span>回頂端</span></button>
</template>

<style lang="less">
  .toTop {
    display: block;
    position: fixed;
    right: 100px;
    bottom: 80px;
    width: 42px;
    height: 42px;
    background: white url('../assets/images/toTop.svg') no-repeat center 9px;
    background-size: 70%;
    border: 2px solid gray;
    border-radius: 50%;
    cursor: pointer;
    &:hover {
      background-image: url('../assets/images/toTopHover.svg');
      background-color: white;
      border-color: #009DBF;
    }
    span {
      display: inline-block;
      position: absolute;
      top: 46px;
      left: -5px;
      width: 48px;
      color: gray;
      text-align: center;
      &:hover {
        color: #009DBF;
      }
    }
  }
</style>