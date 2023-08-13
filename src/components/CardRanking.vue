<script setup>

    import { computed } from 'vue';
    import { useCardStore } from '../store/cardStore';
    import { useUserStore } from '../store/userStore';
    import CardPreview from './CardPreview.vue';

    const props = defineProps(['rankingSrc', 'tab', 'totalCost', 'collectionFilter']);
    const cardStore = useCardStore();
    const userStore = useUserStore();

    const tabMap = {
        '現金折扣': ['Cash_Discount', 'Cash_Discount_Percent'],
        '刷卡金回饋': ['Card_Reward', 'Card_Reward_Percent'],
        // '購物平台回饋': []
    };

    // 根據現在選取的標籤做出排名
    const currentRanking = computed(() => {

        return props.rankingSrc.reduce((accumulator, item) => {
            for(let tabType of tabMap[props.tab]) {
                if(item.discount_description?.[tabType]) {
                    item.info = {
                        sortKey: null,
                        descLines: []
                    };
                    if(tabType.includes('_Percent')) {
                        item.info.sortKey = props.totalCost * item.discount_description?.[tabType] / 100;
                        item.info.descLines.push(`消費金額${ props.totalCost } × ${ item.discount_description?.[tabType] }%`);
                        item.info.descLines.push(`→${ props.tab + item.info.sortKey }元`);
                    } else {
                        item.info.sortKey = item.discount_description?.[tabType];
                        item.info.descLines.push(`${ props.tab + item.info.sortKey }元`);
                    }
                    // 只顯示收藏卡片的篩選
                    if(props.collectionFilter) {
                        // 遍歷當前優惠方案的卡片陣列，用戶有收藏的卡片編號先記下來
                        let cardNos = [];
                        for(let cardNo of item.cardNos) {
                            if(userStore.collectionCards.includes(cardNo)) {
                                cardNos.push(cardNo);
                            }
                        }
                        // 卡片陣列有東西的話，再放進排行陣列
                        if(cardNos.length > 0) {
                            accumulator.push({
                                discount_description: item.discount_description,
                                cardNos
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
            </tr>
        </thead>
        <tr v-for="(item, index) in currentRanking">
            <td class="tdRanking">{{ index + 1 }}</td>
            <td class="tdCard">
                <div class="scrollBox">
                    <CardPreview v-for="cardNo in item.cardNos" :card="cardStore.findCard(cardNo)"></CardPreview>
                </div>
            </td>
            <td class="tdDesc">
                <div v-for="line in item.info?.descLines">{{ line }}</div>
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
            width: 20%;
        }
    
        .tdCard {
            width: 30%;
            .scrollBox {
                display: flex;
                flex-direction: column;
                padding: 20px;
                padding-bottom: 10px;
                height: 130px;
            }
        }
    
        .tdDesc {
            padding: 20px;
            width: 50%;
        }
    
    }
</style>