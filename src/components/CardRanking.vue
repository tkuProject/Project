<script setup>

    import { computed } from 'vue';
    import { useCardStore } from '../store/cardStore';
    import { useUserStore } from '../store/userStore';
    import CardPreview from './CardPreview.vue';
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
    };

    // 根據現在選取的標籤做出排名
    const currentRanking = computed(() => {

        return props.rankingSrc.reduce((accumulator, item) => {
            for(let tabType of tabMap[props.tab]) {
                if(item?.[tabType]) {
                    item.info = {
                        sortKey: null,
                        date: '',
                        calculation: null,
                        conclusion: null
                    };
                    if(item?.specific_duration_start) {
                        item.info.date += dateToShow(item.specific_duration_start);
                    }
                    if(item?.specific_duration_end) {
                        item.info.date += '~' + dateToShow(item.specific_duration_end);
                    }
                    if(tabType.includes('_Percent')) {
                        item.info.sortKey = props.totalCost * item?.[tabType] / 100;
                        if(item?.Reward_upper_limit && item.info.sortKey > item?.Reward_upper_limit) {
                            item.info.sortKey = item.Reward_upper_limit;
                        }
                        item.info.calculation = `消費金額${ props.totalCost }元 × ${ item?.[tabType] }% ↓`;
                    } else {
                        item.info.sortKey = item?.[tabType];
                    }
                    item.info.conclusion = `${ props.tab + item.info.sortKey }元`;
                    // 只顯示收藏卡片的篩選
                    if(props.collectionFilter) {
                        // 遍歷當前優惠方案的卡片陣列，用戶有收藏的卡片編號先記下來
                        let cardNos = [];
                        for(let cardNo of item?.cardNos) {
                            if(userStore.collectionCards.includes(cardNo)) {
                                cardNos.push(cardNo);
                            }
                        }
                        // 卡片陣列有東西的話，再放進排行陣列
                        if(cardNos.length > 0) {
                            accumulator.push({
                                Reward_upper_limit: item.Reward_upper_limit,
                                cardNos,
                                info: item.info
                            });
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
        
    });

</script>

<template>
    <table>
        <thead>
            <tr>
                <th class="tdRanking">名次</th>
                <th class="tdCard">卡片</th>
                <th class="tdDesc">優惠內容</th>
                <th class="tdDesc">注意事項</th>
            </tr>
        </thead>
        <tr v-for="(item, index) in currentRanking">
            <td class="tdRanking">{{ index + 1 }}</td>
            <td class="tdCard">
                <div class="scrollBox">
                    <CardPreview v-for="cardNo in item.cardNos" :card="cardStore.findCard(cardNo)"></CardPreview>
                </div>
            </td>
            <td class="tdDesc content">
                <div class="scrollBox">
                    <div>{{ '網站：' + props.platforms.find(platform => platform.sNo == item?.sNo)?.sName }}</div>
                    <div v-if="item.info.date">{{ '日期：' + item.info.date }}</div>
                    <div v-for="conditionName in Object.keys(conditions)">
                        <template v-if="item?.[conditionName]">
                            {{ conditions[conditionName] + '：' + item[conditionName] }}
                        </template>
                    </div>
                    <div v-if="item?.Reward_upper_limit">
                        {{ '回饋上限：' + item.Reward_upper_limit }}
                    </div>
                    <div>{{ item.info.calculation }}</div>
                    <div class="conclusion">{{ item.info.conclusion }}</div>
                </div>
            </td>
            <td class="tdDesc content">
                <div class="scrollBox">
                    {{ item.Precautions }}
                </div>
            </td>
        </tr>
    </table>
</template>

<style lang="less" scoped>
    table {

        width: 100%;
        text-align: center;
        color: gray;
        background-color: white;
        border: 1px solid gray;
        border-collapse: collapse;

        th, td {
            font-weight: normal;
            border: 1px solid gray;
        }
    
        .tdRanking {
            width: 10%;
        }
    
        .tdCard {
            width: 30%;
            .scrollBox {
                display: flex;
                flex-direction: column;
                padding: 20px;
                padding-bottom: 10px;
                height: 170px;
            }
        }
    
        .tdDesc {
            padding: 20px;
            width: 30%;
            .scrollBox {
                height: 130px;
                .conclusion {
                    color: #009DBF;
                }
            }
        }
        .content {
            text-align: left;
        }
    
    }
</style>