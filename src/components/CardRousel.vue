<script setup>

    import { onMounted, ref, watch } from 'vue';
    import CardPreview from './CardPreview.vue';

    const props = defineProps(['cards']);

    const windowEl = ref();
    const listEl = ref();

    let listItems;
    let listItemMargin;

    const leftArrowEl = ref();
    const rightArrowEl = ref();

    let cardWidth;

    onMounted(async() => {

        let maxHeight = null;
        watch(() => props.cards, async () => {

            listItems = Array.from(listEl.value.children);
            listItemMargin = (windowEl.value.parentNode.clientWidth - listItems[0].offsetWidth)/2;

            await new Promise(resolve => {
                setTimeout(resolve);
            });

            listItems.forEach(item => {
                item.style.margin = '0' + listItemMargin + 'px';
                if(item.offsetHeight > maxHeight) {
                    maxHeight = item.offsetHeight;
                }
            });
            windowEl.value.style.height = maxHeight + 'px';
        
            cardWidth = listItemMargin * 2 + listItems?.[0].offsetWidth;
            
        }, { immediate: true });

    });

    const goLeft = () => {
        if(listEl.value.offsetLeft < 0) {
            listEl.value.style.left = `${ listEl.value.offsetLeft + cardWidth }px`;
        }
        if(listEl.value.offsetLeft <= 0) {
            leftArrowEl.value.classList.add('disabled');
        }
        if(rightArrowEl.value.classList.contains('disabled')) {
            rightArrowEl.value.classList.remove('disabled');
        }
    };

    const goRight = () => {
        if(listEl.value.offsetLeft < listEl.value.offsetWidth) {
            listEl.value.style.left = `${ listEl.value.offsetLeft - cardWidth }px`;
        }
        console.log(`listEl.value.offsetLeft: ${ listEl.value.offsetLeft }`);
        console.log(`listEl.value.offsetWidth-cardWidth: ${ listEl.value.offsetWidth-cardWidth }`);
        if(Math.abs(listEl.value.offsetLeft) <= listEl.value.offsetWidth-cardWidth) {
            rightArrowEl.value.classList.add('disabled');
        }
        if(leftArrowEl.value.classList.contains('disabled')) {
            leftArrowEl.value.classList.remove('disabled');
        }
    };

</script>

<template>

    <div ref="windowEl" class="window">

        <div class="list" ref="listEl">
            <CardPreview v-for="item in props.cards" :card="item"></CardPreview>
        </div>

        <div @click="goLeft" ref="leftArrowEl" class="arrow leftArrow disabled"></div>
        <div @click="goRight" ref="rightArrowEl" class="arrow rightArrow"></div>

    </div>

</template>

<style lang="less" scoped>

    .window {
        display: flex;
        align-items: center;
        position: relative;
        margin: auto;
        border: unset;
        overflow: hidden;
        .list {
            display: flex;
            position: absolute;
            transition: .2s;
        }
        .disabled {
            opacity: .5;
        }
    }

</style>