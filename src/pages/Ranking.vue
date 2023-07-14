<script setup>

    import { ref } from 'vue';
    import CardPreview from '../components/CardPreview.vue';

    const rankingType = ref('請選擇排行榜類型');
    const typeOpts = ['這種類型', '那種類型', '還有這種類型'];

    const cards = [];
    // ↓造假卡的，記得改
    for(let i=0; i<10; i++) {
        let card = {
            name: '覆蓋一張卡',
            src: 'https://images.contentstack.io/v3/assets/blt4ca32b8be67c85f8/blt93e64887e1209558/613b200cab64c62537a81256/Fotoram.io_(3).png?width=256&disable=upscale&fit=bounds&auto=webp',
            score: 300-i*20
        };
        cards.push(card);
    }
    const maxScore = cards[0].score;

    const barColor = ['rgb(255, 115, 115)', 'rgb(255, 210, 120)', 'rgb(120, 255, 183)', 'rgb(125, 164, 255)'];
    const ranNum = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

</script>

<template>

    <select v-model="rankingType">
        <option selected disabled hidden class="selectText">請選擇排行榜類型</option>
        <option v-for="opt in typeOpts">{{ opt }}</option>
    </select>

    <ul class="rankingGraph">
        <li v-for="i in 4">
            <CardPreview :card="cards[i-1]"></CardPreview>
            <div class="chartBar" :style="{ height: cards[i-1].score / (maxScore/200) + 'px', backgroundColor: barColor[i-1] }"></div>
        </li>
        <img src="../assets/images/小王冠.png" alt="" class="crown">
    </ul>

    <div class="ranking">
        <ul>
            <li v-for="num in ranNum">
                第{{ num }}名　覆蓋一張卡
            </li>
        </ul>
    </div>

</template>

<style lang="less" scoped>

    select {
        display: block;
        margin: 50px auto;
        width: 300px;
        height: 40px;
        text-align: center;
        .selectText {
            color: gray;
        }
    }

    .rankingGraph {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: space-evenly;
        position: relative;
        padding-top: 30px;
        width: 100%;
        height: 320px;
        background-color: white;
        box-shadow: 0 8px 8px rgba(0, 0, 0, .2);
        li {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 18%;
            .chartBar {
                width: 60px;
                border-radius: 12px 12px 0 0;
            }
        }
        .crown {
            position: absolute;
            top: 16px;
            left: 18px;
            width: 40px;
            height: 30px;
            transform: rotate(-25deg);
            filter: drop-shadow(0 8px 4px rgba(0, 0, 0, .5))
        }
    }

    .ranking {
        display: flex;
        justify-content: center;
        margin: auto;
        margin-top: 30px;
        padding: 10px 0;
        width: 80%;
        text-align: center;
        background-color: rgba(255, 255, 255, .5);
        border: 1px solid gray;
        border-radius: 12px;
        ul {
            text-align: left;
            li {
                margin: 10px 0;
                font-size: 18px;
                color: gray;
                cursor: pointer;
                &:hover {
                    color: #009DBF;
                }
            }
        }
    }

</style>