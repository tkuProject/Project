<script setup>

    import { computed, reactive, ref } from 'vue';
    import CardPreview from '../components/CardPreview.vue';
    import sendReq from '../utils/sendReq';

    const typeOpts = reactive(await sendReq('getRankingCate').then(json => {
        if(json.status == 200) {
            return json.rankingCates;
        }
    }));
    const rankingType = ref(null);

    const cards = computed(() => {
        sendReq('ranking', {
            query: {
                Category_No: typeOpts.find(item => item.Category_Name == rankingType.value).Category_No 
            }
        }).then(json => {
            if(json.status == 200) {
                return json.ranksCard;
            }
        });
    });
    const maxScore = cards[0].weight_score;

    const barColor = ['rgb(255, 115, 115)', 'rgb(255, 210, 120)', 'rgb(120, 255, 183)', 'rgb(125, 164, 255)'];
    const ranNum = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

</script>

<template>

    <select v-model="rankingType">
        <option v-for="opt in typeOpts">{{ opt.Category_Name }}</option>
    </select>

    <ul class="rankingGraph">
        <li v-for="(color, index) in barColor">
            <img v-if="index==1" src="../assets/images/小王冠.png" alt="" class="crown">
            <CardPreview :card="cards[index-1]"></CardPreview>
            <div class="chartBar" :style="{ height: cards[index-1].weight_score / (maxScore/200) + 'px', backgroundColor: color }"></div>
        </li>
    </ul>

    <div class="ranking">
        <ul>
            <li v-for="(card, index) in cards">
                <CardPreview :card="card" :name-prefix="'第' + ranNum[index] + '名　'" :only-name="true">
                </CardPreview>
            </li>
        </ul>
    </div>

</template>

<style lang="less" scoped>

    select {
        display: block;
        margin: 50px auto;
        margin-top: 0;
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
        padding-top: 40px;
        width: 100%;
        background-color: white;
        box-shadow: 0 8px 8px rgba(0, 0, 0, .2);
        li {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            width: 18%;
            .chartBar {
                width: 60px;
                border-radius: 12px 12px 0 0;
            }
            .crown {
                position: absolute;
                top: -24px;
                left: -16px;
                width: 40px;
                height: 30px;
                transform: rotate(-25deg);
                filter: drop-shadow(0 8px 4px rgba(0, 0, 0, .5))
            }
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
        }
    }

</style>