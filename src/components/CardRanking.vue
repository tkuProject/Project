<script setup>

    import { computed } from 'vue';
    import { useCardStore } from '../store/cardStore';
    import { useUserStore } from '../store/userStore';
    import CardPreview from './CardPreview.vue';
    import Carousel from './Carousel.vue';
    import { dateToShow } from '../utils/dateFormat';

    const props = defineProps(['rankingSrc', 'tab', 'platforms', 'totalCost', 'collectionFilter']);
    const cardStore = useCardStore();
    const userStore = useUserStore();

    const tabMap = {
        '現金折扣': ['Cash_Discount', 'Cash_Discount_Percent'],
        '刷卡金回饋': ['Card_Reward', 'Card_Reward_Percent'],
        '購物平台回饋': ['Shopping_Platform_Reward']
    };

    const conditions = {
        single_consumption_threshold: '單筆消費門檻',
        single_installments_threshold: '單筆分期門檻',
        cumulative_installments_threshold: '累積分期門檻'
    };

    // 根據現在選取的標籤做出排名
    const currentRanking = computed(() => {

        const ranking = props.rankingSrc.reduce((accumulator, item) => {
            for(let tabType of tabMap[props.tab]) {
                if(item?.[tabType]) {
                    item.info = {
                        sortKey: null,
                        date: '',
                        calculation: '',
                        conclusion: '',
                        unit: '元'
                    };
                    if(item?.specific_duration_start) {
                        item.info.date += dateToShow(item.specific_duration_start);
                    }
                    if(item?.specific_duration_end) {
                        item.info.date += '~' + dateToShow(item.specific_duration_end);
                    }
                    if(tabType.includes('_Percent')) {
                        item.info.sortKey = props.totalCost * item?.[tabType];
                        if(item?.Reward_upper_limit && item.info.sortKey > item?.Reward_upper_limit) {
                            item.info.sortKey = item.Reward_upper_limit;
                        }
                        item.info.calculation += `消費金額${ props.totalCost }元 × ${ item?.[tabType] }`;
                        item.info.conclusion += '→';
                    } else {
                        item.info.sortKey = item?.[tabType];
                    }
                    if(tabType == 'Shopping_Platform_Reward') {
                        if(item.dNote?.includes('紅利金')) {
                            item.info.unit = '紅利金';
                        } else {
                            item.info.unit = props.platforms?.find(platform => platform.sNo == item.sNo).unit;
                        }
                    }
                    if(tabType.includes('Card_Reward') && item.dNote?.includes('小樹點')) {
                        item.info.unit = '小樹點';
                    }
                    if(props.tab == '現金折扣' && tabType.includes('_Percent')) {
                        item.info.conclusion += `${ '折後金額：' + (props.totalCost - props.totalCost * item?.[tabType]) + item.info.unit }
                        （${ props.tab + '：' + item.info.sortKey + item.info.unit }）`;
                    } else {
                        item.info.conclusion += `${ props.tab + '：' + item.info.sortKey + item.info.unit }`;
                    }
                    // 只顯示收藏卡片的篩選
                    if(props.collectionFilter) {
                        // 遍歷當前優惠方案的卡片陣列，用戶有收藏的卡片編號先記下來
                        let collectCardNos = [];
                        for(let cardNo of item?.cardNos) {
                            if(userStore.collectionCards.includes(cardNo)) {
                                collectCardNos.push(cardNo);
                            }
                        }
                        // 卡片陣列有東西的話，把所有屬性都抄一份，放進排行陣列
                        if(collectCardNos.length > 0) {
                            const card = {};
                            for(let key of Object.keys(item)) {
                                card[key] = item[key];
                            }
                            card.cardNos = collectCardNos;
                            accumulator.push(card);
                        }
                    } else {
                        accumulator.push(item);
                    }
                }
            }
            return accumulator;
        }, []).sort((a, b) => {
            return b.info?.sortKey - a.info?.sortKey;
        });

        const cumulInstArr = ranking.filter(item => {
            return item.cumulative_installments_threshold && item.cumulative_installments_threshold > props.totalCost;
        });

        for(item in cumulInstArr) {
            ranking.splice(ranking.indexOf(item), 1);
            ranking.push(item);
        }

        return ranking;
        
    });

</script>

<template>
    <table>
        <thead>
            <tr>
                <th>名次</th>
                <th>相關卡片</th>
                <th>優惠內容</th>
                <th>注意事項</th>
            </tr>
        </thead>
        <tr v-for="(item, index) in currentRanking">
            <td class="tdRanking">{{ index + 1 }}</td>
            <td class="tdCard">
                <Carousel :re-load-list="props.collectionFilter">
                    <CardPreview v-for="cardNo in item.cardNos" :card="cardStore.findCard(cardNo)"></CardPreview>
                </Carousel>
            </td>
            <td class="tdDesc content">
                <div class="scrollBox">
                    <div>{{ '網站：' + props.platforms.find(platform => platform.sNo == item?.sNo)?.sName }}</div>
                    <div v-if="item.info?.date">日期：</div>
                    <div v-if="item.info?.date">{{ item.info?.date }}</div>
                    <span v-if="item.thoseDays?.length > 0">之間的{{ item.thoseDays.map(date => dateToShow(date)).join('、') }}</span>
                    <div v-if="item?.Reward_upper_limit">
                        {{ '回饋上限：' + item.Reward_upper_limit }}
                    </div>
                    <br>
                    <div>{{ item.info?.calculation }}</div>
                    <div class="conclusion">{{ item.info?.conclusion }}</div>
                </div>
            </td>
            <td class="tdDesc content">
                <div class="scrollBox">
                    <div v-for="conditionName in Object.keys(conditions)">
                        <template v-if="item?.[conditionName]">
                            {{ conditions[conditionName] + '：' + item[conditionName] }}
                            <template v-if="conditions[conditionName] == '累積分期門檻'">
                                （本月累積分期金額達{{ item[conditionName] }}元即可享有此優惠）
                            </template>
                        </template>
                    </div>
                    <span class="imPrecautions">{{ item.important_precautions_content }}</span>
                    {{ item.Precautions_content }}
                </div>
            </td>
        </tr>
    </table>
    <div v-if="currentRanking.length == 0" class="nothingHint">
        沒有符合條件的優惠方案
    </div>
</template>

<style lang="less" scoped>
    table {

        width: 100%;
        text-align: center;
        color: gray;
        background-color: white;
        border: 1px solid gray;
        border-collapse: collapse;

        th {
            height: 60px;
        }

        th, td {
            font-weight: normal;
            border: 1px solid gray;
        }
    
        .tdRanking {
            width: 10%;
        }
    
        .tdDesc {
            padding: 20px;
            width: 26%;
            .scrollBox {
                .conclusion {
                    color: #009DBF;
                }
                .imPrecautions {
                    color: red;
                }
            }
        }
        .content {
            text-align: left;
        }
    
    }
</style>