<script setup>

    import PopUpBox from './PopUpBox.vue';

    const props = defineProps(['card', 'show']);

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
    
    <PopUpBox :show="props.show">

        <template #tab>卡片詳情</template>

        <template #content>
        
            <img :src="props.card.src" alt="" class="detailCard">
            <div class="cardName">{{ props.card.name }}</div>
            <ul class="infoUl scrollBox">
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

    .detailCard {
        display: block;
        margin: 20px auto;
        margin-bottom: 0;
        height: 100px;
    }

    .cardName {
        text-align: center;
        font-size: 20px;
        line-height: 50px;
    }

    .infoUl {
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        margin: 10px;
        padding-top: 20px;
        width: 400px;
        height: 250px;
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
        hr {
            margin: auto;
            width: 90%;
            border: 1px solid lightgray;
        }
        .note {
            margin: 20px;
            color: gray;
            text-align: left;
        }
    }
    
</style>