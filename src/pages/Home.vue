<script setup>

    import { reactive, ref, watch } from 'vue';
    import { useUserStore } from '../store/userStore';
    import Tags from '../components/Tags.vue';
    import CardRanking from '../components/CardRanking.vue';
    import sendReq from '../utils/sendReq';

    const userStore = useUserStore();

    // 準備各個購物平台，和一個用來記錄當前選定購物平台的變數
    const platforms = reactive(await sendReq('getPlatform').then(json => {
        if(json.status == 200) {
            return json.platforms;
        }
    }));
    const selectedPlatforms = reactive([platforms[0].sNo]);
    // 點選購物平台
    const clickPlatform = sNo => {
        if(selectedPlatforms.includes(sNo)) {
            if(selectedPlatforms.length > 1) {
                selectedPlatforms.splice(selectedPlatforms.indexOf(sNo), 1);
            } else {
                alert('至少要選擇一個網站喔～');
            }
        } else {
            selectedPlatforms.push(sNo);
        }
    };
    const selectAllPlatforms = () => {
        for(let item of platforms) {
            if(!selectedPlatforms.includes(item.sNo)) {
                selectedPlatforms.push(item.sNo);
            }
        }
    };

    // 記錄使用者在表單輸入的值
    const installment = ref(false);
    const installmentMonths = ref(null);
    const totalCost = ref(null);
    const date = ref(null);
    const onlyMyCard = ref(false);

    const rankingSrc = reactive([]);
    const startCompare = async () => {
        rankingSrc.length = 0;
        rankingSrc.push(...await sendReq('compFilter', {
            query: {
                platforms: selectedPlatforms,
                installment: installment.value,
                costPerMonth: totalCost.value/installmentMonths.value,
                totalCost: totalCost.value,
                date: date.value
            }
        }).then(json => {
            if(json.status == 200) {
                return json.results;
            }
        }));
    };

    // 準備試算標籤列表，和一個用來記錄當前選定標籤的變數
    const calculateResultTags = [
        "現金折扣",
        "刷卡金回饋",
        "購物平台回饋"
    ];
    const selectedTag = ref('現金折扣');

</script>

<template>

    <div class="platformBox">
        <span>請選擇欲比較之網站：</span>
        <button @click="selectAllPlatforms">選擇全部網站</button>
        <ul>
            <li v-for="item in platforms">
                <img @click="clickPlatform(item.sNo)" :src="item.sImg_Site" alt="" :class="{ platformSelected: selectedPlatforms.includes(item.sNo) }">
            </li>
        </ul>
    </div>

    <ul class="conditions">

        <li>
            <span class="conditionTitle">是否分期</span>
            <div class="conditionField">
                <label>
                    <input v-model="installment" type="radio" name="installmentOrNot" :value="true">
                    有分期
                </label>
                <span>　</span>
                <label>
                    <input v-model="installment" type="radio" name="installmentOrNot" :value="false">
                    無分期
                </label>
            </div>
        </li>
        
        <li v-if="installment" class="installmentTimes">
            <span class="conditionTitle">分期期數</span>
            <input v-model="installmentMonths" type="number" class="conditionField" placeholder="請輸入分期期數">
        </li>
        
        <li>
            <span class="conditionTitle">消費總額</span>
            <input v-model="totalCost" type="number" class="conditionField" placeholder="請輸入消費總金額">
        </li>
        
        <li>
            <span class="conditionTitle">消費日期</span>
            <input v-model="date" type="date" class="conditionField">
        </li>

        <li class="compareStart">
            <button @click="startCompare" type="button">開始比較</button>
        </li>

    </ul>

    <div class="tagWrapper">
        <Tags :types="calculateResultTags" v-model="selectedTag"></Tags>

        <div class="onlyMyCard" v-if="userStore.account">
            <label>
                <input v-model="onlyMyCard" type="checkbox">
                只顯示我的收藏
            </label>
        </div>
    </div>
    
    <CardRanking :ranking-src="rankingSrc" :tab="selectedTag" :total-cost="totalCost" :collection-filter="onlyMyCard"></CardRanking>

</template>

<style lang="less" scoped>

    .platformBox {
        position: relative;

        span {
            color: gray;
        }

        button {
            position: absolute;
            right: 0;
            padding: 6px;
            width: 100px;
        }

        ul {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            align-items: center;
            margin: 40px auto;
            height: 64px;
            li {
                img {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: .2s;
                }
                img:hover {
                    width: 60px;
                    height: 60px;
                }
                .platformSelected {
                    width: 60px;
                    height: 60px;
                    border: 2px solid gray;
                }
            }
        }

    }

    .conditions {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 50px;

        li {
            display: flex;
            align-items: center;
            width: 100%;
            height: 40px;

            label {
                color: gray;
            }

            .conditionTitle {
                display: inline-block;
                width: 29%;
                height: 40px;
                text-align: center;
                line-height: 40px;
                background-color: rgba(255, 255, 255, .5);
                border: 1px solid gray;
            }

            .conditionField {
                display: inline-block;
                width: 70%;
                height: 40px;
                text-align: center;
                line-height: 40px;
                background-color: rgba(255, 255, 255, .5);
                border: 1px solid gray;
            }
        }

        .installmentTimes {
            span, input {
                background-color: rgba(207, 246, 255, .5);
            }
        }

        .compareStart {
            margin-top: 30px;
            button {
                display: block;
                margin: auto;
                width: 180px;
                height: 100%;
                font-size: 16px;
            }
        }

    }

    .tagWrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .onlyMyCard {
            text-align: center;
            label {
                display: block;
                margin: auto;
                height: 40px;
                line-height: 40px;
            }
        }
    }

</style>