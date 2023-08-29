<script setup>

    import { computed, reactive, ref } from 'vue';
    import { useUserStore } from '../store/userStore';
    import Tags from '../components/Tags.vue';
    import CardRanking from '../components/CardRanking.vue';
    import sendReq from '../utils/sendReq';
    import { dateToDateTime } from '../utils/dateFormat';

    const userStore = useUserStore();

    // 準備各個購物平台，和一個用來記錄當前選定購物平台的變數
    const platforms = reactive(await sendReq('getPlatform').then(json => {
        if(json.status == 200) {
            return json.platforms;
        }
    }));
    const selectedPlatforms = reactive([platforms?.[0].sNo]);
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
    const affordableAmount = ref(null);
    const totalCost = ref(null);
    // 記錄開始日期與結束日期
    const now = new Date();
    const startDate = ref(dateToDateTime(now));
    const passedDaysSelections = {
        '今天': 0,
        '未來3天': 3,
        '未來7天': 7,
        '未來15天': 15,
        '未來30天': 30
    };
    const passedDays = ref('今天');
    const endDate = computed(() => {
        const date = new Date(startDate.value);
        date.setDate(date.getDate() + passedDaysSelections[passedDays.value]);
        return dateToDateTime(date);
    });

    const onlyMyCard = ref(false);

    const rankingSrc = reactive([]);
    const startCompare = async () => {
        if(!totalCost.value) {
            alert('要先輸入消費總額才能開始比較喔～');
        } else if (installment.value && !affordableAmount.value) {
            alert('分期付款的情況需要輸入一年願意負擔的金額喔～');
        } else {
            rankingSrc.length = 0;
            rankingSrc.push(...await sendReq('compFilter', {
                query: {
                    platforms: selectedPlatforms,
                    installment: installment.value,
                    costPerMonth: installment.value ? affordableAmount/12 : null,
                    totalCost: totalCost.value,
                    startDate: startDate.value,
                    endDate: endDate.value
                }
            }).then(json => {
                if(json.status == 200) {
                    return json.results;
                }
            }));
        }
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
                <span>{{ item.sname }}</span>
            </li>
        </ul>
    </div>

    <ul class="conditions">

        <li>
            <span class="condition conditionTitle">是否分期</span>
            <div class="condition conditionField">
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
        
        <li v-if="installment" class="affordableAmount">
            <span class="condition conditionTitle">一年願意負擔的金額</span>
            <input v-model="affordableAmount" type="number" class="condition conditionField" placeholder="請輸入一年願意負擔的金額">
        </li>
        
        <li>
            <span class="condition conditionTitle">消費總額</span>
            <input v-model="totalCost" type="number" min="0" oninput="if(value<0) value=0" class="condition conditionField" placeholder="請輸入消費總金額">
        </li>
        
        <li>
            <span class="condition">
                只顯示
                <select v-model="passedDays">
                    <option v-for="key in Object.keys(passedDaysSelections)">{{ key }}</option>
                </select>
                之內的優惠
            </span>
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
    
    <CardRanking :ranking-src="rankingSrc" :tab="selectedTag" :platforms="platforms" :total-cost="totalCost" :collection-filter="onlyMyCard"></CardRanking>

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
            margin-bottom: 50px;
            height: 64px;
            li {
                display: flex;
                flex-direction: column;
                align-items: center;
                img {
                    margin-bottom: 10px;
                    width: 80px;
                    height: 40px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: .2s;
                }
                img:hover {
                    width: 120px;
                    height: 60px;
                }
                .platformSelected {
                    width: 120px;
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

            .condition {
                display: inline-block;
                width: 100%;
                height: 40px;
                text-align: center;
                line-height: 40px;
                background-color: rgba(255, 255, 255, .5);
                border: 1px solid gray;
            }

            .conditionTitle {
                width: 30%;
            }

            .conditionField {
                width: 70%;
            }
        }

        .affordableAmount {
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