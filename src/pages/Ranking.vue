<script setup>

    import { reactive, ref, watch } from 'vue';
    import { useCardStore } from '../store/CardStore';
    import CardPreview from '../components/CardPreview.vue';
    import sendReq from '../utils/sendReq';

    const cardStore = useCardStore();

    const rankingType = ref(null);
    const typeOpts = reactive(await sendReq('getRankingCate').then(json => {
        if(json.status == 200) {
            rankingType.value = json.rankingCates[0]?.Category_Name;
            return json.rankingCates;
        }
    }));

    const maxScore = ref(null);
    const rankList = reactive([]);
    watch(rankingType, () => {
        sendReq('ranking', {
            query: {
                Category_No: typeOpts.find(item => item.Category_Name == rankingType.value)?.Category_No 
            }
        }).then(json => {
            if(json.status == 200) {
                maxScore.value = json.ranksCard[0]?.weight_score;
                json.ranksCard.map(item => {
                    item.card = cardStore.findCard(item.Card_No);
                });
                rankList.length = 0;
                rankList.push(...json.ranksCard);
            }
        });
    }, { immediate: true });

    const barColor = ['rgb(255, 115, 115)', 'rgb(255, 210, 120)', 'rgb(120, 255, 183)', 'rgb(125, 164, 255)'];
    const ranNum = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

</script>

<template>

    <select v-model="rankingType">
        <option v-for="opt in typeOpts">{{ opt.Category_Name }}</option>
    </select>

    <ul class="rankingGraph">
        <li v-for="(color, index) in barColor">
            <img v-if="index==0" src="../assets/images/小王冠.png" alt="" class="crown">
            <div class="cardBox">
                <CardPreview :card="rankList[index]?.card"></CardPreview>
            </div>
            <div class="chartBar" :style="{ height: rankList[index]?.weight_score / (maxScore/200) + 'px', backgroundColor: color }"></div>
        </li>
    </ul>

    <div class="ranking">
        <ul>
            <li v-for="(rank, index) in rankList">
                <CardPreview :card="rank.card" :name-prefix="'第' + ranNum[index] + '名　'" :only-name="true">
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
        padding-top: 6vh;
        width: 100%;
        background-color: white;
        box-shadow: 0 8px 8px rgba(0, 0, 0, .2);
        @media screen and (max-width: 767px) {
            padding-top: 4vh;
        }
        li {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            width: 20%;
            .cardBox {
                max-width: 100%;
                height: 160px;
            }
            .chartBar {
                width: 60px;
                border-radius: 12px 12px 0 0;
            }
            .crown {
                position: absolute;
                top: -15px;
                left: -16px;
                width: 40px;
                height: 30px;
                transform: rotate(-25deg);
                filter: drop-shadow(0 8px 4px rgba(0, 0, 0, .5));
                @media screen and (max-width: 767px) {
                    top: -10px;
                    left: 10px;
                    transform: unset;
                }
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
        @media screen and (max-width: 767px) {
            width: 100%;
        }
        ul {
            text-align: left;
        }
    }

</style>