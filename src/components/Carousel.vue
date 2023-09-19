<script setup>

    import { nextTick, onMounted, ref, watch } from 'vue';

    const props = defineProps(['reLoadList']);

    const windowEl = ref();
    const listEl = ref();

    let listItems;
    let listItemMargin;

    const leftArrowEl = ref();
    const rightArrowEl = ref();

    let cardWidth;

    const calcuList = async () => {
        
        let maxHeight = null;

        listItems = Array.from(listEl.value.children);

        checkArrow();

        if(listItems.length == 1) {
            rightArrowEl.value.classList.add('disabled');
        }
        listItemMargin = (windowEl.value.parentNode.clientWidth - listItems[0].offsetWidth)/2;

        await new Promise(resolve => setTimeout(resolve, 200));

        listItems.forEach(item => {
            item.style.margin = '0 ' + listItemMargin + 'px';
            if(item.offsetHeight > maxHeight) {
                maxHeight = item.offsetHeight;
            }
        });
        windowEl.value.style.height = maxHeight + 'px';
        
        cardWidth = listItemMargin * 2 + listItems?.[0].offsetWidth;

    };

    onMounted(calcuList);

    let currentIndex = ref(0);

    const goLeft = () => {
        if(currentIndex.value > 0) {
            currentIndex.value -= 1;
        }
    };

    const goRight = () => {
        if(currentIndex.value < listItems.length-1) {
            currentIndex.value += 1;
        }
    };

    const checkArrow = () => {
        if(currentIndex.value == 0) {
            leftArrowEl.value.classList.add('disabled');
        } else if(currentIndex.value < 0) {
            currentIndex.value = 0;
        } else if(leftArrowEl.value.classList.contains('disabled')) {
            leftArrowEl.value.classList.remove('disabled');
        }
        if(currentIndex.value == listItems.length - 1 || listItems.length <= 1) {
            rightArrowEl.value.classList.add('disabled');
        } else if(currentIndex.value > listItems.length - 1) {
            currentIndex.value = listItems.length - 1;
        } else if(rightArrowEl.value.classList.contains('disabled')) {
            rightArrowEl.value.classList.remove('disabled');
        }
    };

    watch(currentIndex, () => {
        checkArrow();
    });

    watch(() => props.reLoadList, async () => {
        currentIndex.value = 0;
        await nextTick();
        calcuList();
    });

</script>

<template>

    <div ref="windowEl" class="window">

        <div class="list" ref="listEl" :style="{ left: `-${ cardWidth * currentIndex }px` }">
            <slot></slot>
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
            opacity: .3;
            cursor: unset;
            &:hover {
                background-image: url('../assets/images/toTop.svg');
            }
        }
    }

</style>