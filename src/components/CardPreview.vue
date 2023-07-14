<script setup>

    import { ref } from 'vue';    
    import PopUpBox from './PopUpBox.vue';

    const props = defineProps(['card']);

    const showDetail = ref({ on: false });
    const cardInfo = [
        {title: '年費', content:'如此如此這般這般'},
        {title: '循環利率', content:'如此如此這般這般'},
        {title: '預借現金手續費', content:'如此如此這般這般'},
        {title: '申辦條件', content:'這樣這樣那樣那樣，如此如此這般這般'},
        {title: '發卡機構', content:'如此如此這般這般'},
        {title: '產品特色＆基本優惠', content:'這樣這樣那樣那樣，如此如此這般這般'}
    ];

</script>

<template>

    <slot name="header"></slot>

    <img @click="showDetail.on=true" :src="props.card.src" alt="" class="previewImg">
    <span @click="showDetail.on=true" class="cardName">{{ props.card.name }}</span>

    <PopUpBox :show="showDetail">

        <template #tab>卡片詳情</template>

        <template #content>

            <img :src="props.card.src" alt="" class="detailCard">
            <div class="bigCardName">{{ props.card.name }}</div>
            <ul class="infoUl">
                <li v-for="item in cardInfo">
                    <div class="infoTitle">
                        {{ item.title }}
                    </div>
                    <p class="infoContent">
                        {{ item.content }}
                    </p>
                </li>
                <hr>
                <li class="note">
                    <span>注意事項：</span>
                    <p>
                        ＊這樣這樣<br>
                        ＊那樣那樣<br>
                        ＊如此如此<br>
                        ＊這般這般
                    </p>
                </li>
            </ul>

        </template>

    </PopUpBox>

</template>

<style lang="less" scoped>

    .previewImg {
        width: 100%;
        cursor: pointer;
        transition: .2s;
        &:hover {
            filter: drop-shadow(0 0 4px #009DBF);
        }
    }

    .cardName {
        display: block;
        padding: 10px 0;
        text-align: center;
        cursor: pointer;
        transition: .2s;
        &:hover {
            color: #009DBF;
        }
    }

    .detailCard {
        display: block;
        margin: 20px auto;
        margin-bottom: 0;
    }

    .bigCardName {
        text-align: center;
        font-size: 24px;
        line-height: 60px;
    }

    .infoUl {
        display: flex;
        flex-direction: column;
        width: 400px;
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
            }
        }
        hr {
            margin: auto;
            width: 90%;
            border: 1px solid lightgray;
        }
        .note {
            margin: 20px;
            color: gray;
        }
    }

</style>