<script setup>

    import CardButton from './CardButton.vue';
    import PopUpBox from './PopUpBox.vue';
    import { useUserStore } from '../store/userStore';

    const props = defineProps(['card', 'show']);

    const userStore = useUserStore();

    const cardInfo = {
        '銀行': 'bank',
        '年費': 'annual_fee',
        '循環利率': 'revolving_interest_rates',
        '預借現金手續費': 'handling_fee',
        '申辦條件': 'application_conditions',
        '發卡機構': 'card_issuer',
        '產品特色＆基本優惠': 'discount_information'
    };

</script>

<template>
    
    <PopUpBox :show="props.show">

        <template #tab>卡片詳情</template>

        <template #content>
        
            <div class="wrapper">

                <div class="cardBox">
                    <img :src="props.card.Img_Site" alt="" class="detailCard">
                    <div class="cardName">{{ props.card.Card_Name }}</div>
                    <template v-if="userStore.account">
                        <CardButton :card-no="props.card.Card_No" text-mode="true"></CardButton>
                    </template>
                </div>
                
                <ul class="infoUl scrollBox">
                    <template v-for="(item, key) in cardInfo">
                        <li v-if="props.card?.[item]">
                            <div class="infoTitle">
                                {{ key }}
                            </div>
                            <p class="infoContent">
                                {{ props.card[item] }}
                            </p>
                        </li>
                    </template>
                </ul>

            </div>
        
        </template>

    </PopUpBox>

</template>

<style lang="less" scoped>

    .wrapper {
        display: flex;
        padding: 20px;
        .cardBox {
            width: 200px;
            .detailCard {
                display: block;
                margin: 0 auto;
                height: 100px;
            }
            .cardName {
                text-align: center;
                font-size: 20px;
                line-height: 50px;
            }
        }
        .infoUl {
            display: flex;
            flex-direction: column;
            margin-left: 20px;
            padding-top: 20px;
            width: 400px;
            height: 500px;
            color: black;
            background-color: rgba(255, 247, 206, .5);
            border-radius: 12px;
            li {
                margin: 0 20px;
                .infoTitle {
                    width: 100%;
                    height: 40px;
                    font-size: 18px;
                    line-height: 40px;
                    text-align: left;
                    text-indent: 12px;
                    background-color: rgba(0, 157, 191, .1);
                    border: 1px solid #009DBF;
                    border-radius: 12px;
                }
                .infoContent {
                    padding: 20px;
                    text-align: left;
                }
            }
        }
    }
    
</style>