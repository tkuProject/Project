<script setup>

    const props = defineProps(['src', 'name', 'id']);

</script>

<template>
    <slot name="header"></slot>
    <img :src="src" alt="">
    <span class="cardName">{{ name }}{{ id }}</span>
</template>

<style>

    img {
        width: 100%;
        border: 1px solid gray;
        border-radius: 12px;
    }

    .cardName {
        display: block;
        height: 50px;
        line-height: 50px;
        text-align: center;
    }

</style>