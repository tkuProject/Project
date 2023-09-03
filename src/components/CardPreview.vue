<script setup>

    import { ref } from 'vue';    
    import CardDetail from './CardDetail.vue';

    const props = defineProps(['card', 'namePrefix', 'onlyName']);

    const showDetail = ref({ on: false });

</script>

<template>
    <div :class="props.onlyName ? '' : 'fancyCard'">
        <slot name="header"></slot>

        <div class="wrapper" @click="showDetail.on=true">
            <img v-if="!props.onlyName" :src="props.card?.Img_Site" alt="" class="previewImg">
            <div :class="props.onlyName ? '' : 'fancyCardName'" class="cardName">{{ (props.namePrefix??'') + props.card?.Card_Name }}</div>
        </div>

        <CardDetail :card="props.card" :show="showDetail"></CardDetail>
    </div>

</template>

<style lang="less" scoped>

    .fancyCard {
        background-color: white;
        border: 2px solid #81D9EC;
        border-radius: 12px;
    }
    .wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        height: 100%;
        border-radius: 0 0 12px 12px;
        cursor: pointer;
        .previewImg {
            width: 160px;
            transition: .2s;
            &:hover {
                filter: drop-shadow(0 0 4px #009DBF);
            }
        }
        .cardName {
            box-sizing: border-box;
            padding: 10px;
            width: 100%;
            text-align: center;
            transition: .2s;
            &:hover {
                color: #009DBF;
            }
        }
        .fancyCardName {
            background-color: rgba(129, 217, 236, .3);
            border-radius: 0 0 12px 12px;
        }
    }

</style>