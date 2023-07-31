<script setup>

    import { ref } from 'vue';
    import { useUserStore } from '../store/userStore';
    import Tags from '../components/Tags.vue';
    import CardRanking from '../components/CardRanking.vue';

    const userStore = useUserStore();

    // 準備各個購物平台的圖片網址，和一個用來記錄當前選定購物平台的變數
    const platforms = [
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAJ1BMVEXkAIDkAIDjAHriAHXkAID////86fHtea72vNX63urzqMn4zN7nM414wKpEAAAAAnRSTlO8A6fqfTYAAADPSURBVDiNtZPJEgMhCEQNIODy/98bUcelKs7kkPShpxjfAVpxL0c3ci93e16Ih/NC/AaAqa0agEwh5Vl0AJKfElyKBBVAXv5FA0KV94wXkIjYK1EDBKviCmAxRexA7Q42AAyArwG0GVGPwNAG+AsIy0htTOr5dcM91wrg1FZ1ACRMZYj2YTaXU5I+SOStSU7lPqpVwOYsQZ6TRAsK0zGH9lJAjkCGfA8EYmuCD0la955VbZgGQNQIxQRAi4kO5StJy3QYfHi0f16cx+V9Wv83hYQSPdtBzuYAAAAASUVORK5CYII=",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAJ1BMVEXkAIDkAIDjAHriAHXkAID////86fHtea72vNX63urzqMn4zN7nM414wKpEAAAAAnRSTlO8A6fqfTYAAADPSURBVDiNtZPJEgMhCEQNIODy/98bUcelKs7kkPShpxjfAVpxL0c3ci93e16Ih/NC/AaAqa0agEwh5Vl0AJKfElyKBBVAXv5FA0KV94wXkIjYK1EDBKviCmAxRexA7Q42AAyArwG0GVGPwNAG+AsIy0htTOr5dcM91wrg1FZ1ACRMZYj2YTaXU5I+SOStSU7lPqpVwOYsQZ6TRAsK0zGH9lJAjkCGfA8EYmuCD0la955VbZgGQNQIxQRAi4kO5StJy3QYfHi0f16cx+V9Wv83hYQSPdtBzuYAAAAASUVORK5CYII=",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAJ1BMVEXkAIDkAIDjAHriAHXkAID////86fHtea72vNX63urzqMn4zN7nM414wKpEAAAAAnRSTlO8A6fqfTYAAADPSURBVDiNtZPJEgMhCEQNIODy/98bUcelKs7kkPShpxjfAVpxL0c3ci93e16Ih/NC/AaAqa0agEwh5Vl0AJKfElyKBBVAXv5FA0KV94wXkIjYK1EDBKviCmAxRexA7Q42AAyArwG0GVGPwNAG+AsIy0htTOr5dcM91wrg1FZ1ACRMZYj2YTaXU5I+SOStSU7lPqpVwOYsQZ6TRAsK0zGH9lJAjkCGfA8EYmuCD0la955VbZgGQNQIxQRAi4kO5StJy3QYfHi0f16cx+V9Wv83hYQSPdtBzuYAAAAASUVORK5CYII=",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAJ1BMVEXkAIDkAIDjAHriAHXkAID////86fHtea72vNX63urzqMn4zN7nM414wKpEAAAAAnRSTlO8A6fqfTYAAADPSURBVDiNtZPJEgMhCEQNIODy/98bUcelKs7kkPShpxjfAVpxL0c3ci93e16Ih/NC/AaAqa0agEwh5Vl0AJKfElyKBBVAXv5FA0KV94wXkIjYK1EDBKviCmAxRexA7Q42AAyArwG0GVGPwNAG+AsIy0htTOr5dcM91wrg1FZ1ACRMZYj2YTaXU5I+SOStSU7lPqpVwOYsQZ6TRAsK0zGH9lJAjkCGfA8EYmuCD0la955VbZgGQNQIxQRAi4kO5StJy3QYfHi0f16cx+V9Wv83hYQSPdtBzuYAAAAASUVORK5CYII=",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAJ1BMVEXkAIDkAIDjAHriAHXkAID////86fHtea72vNX63urzqMn4zN7nM414wKpEAAAAAnRSTlO8A6fqfTYAAADPSURBVDiNtZPJEgMhCEQNIODy/98bUcelKs7kkPShpxjfAVpxL0c3ci93e16Ih/NC/AaAqa0agEwh5Vl0AJKfElyKBBVAXv5FA0KV94wXkIjYK1EDBKviCmAxRexA7Q42AAyArwG0GVGPwNAG+AsIy0htTOr5dcM91wrg1FZ1ACRMZYj2YTaXU5I+SOStSU7lPqpVwOYsQZ6TRAsK0zGH9lJAjkCGfA8EYmuCD0la955VbZgGQNQIxQRAi4kO5StJy3QYfHi0f16cx+V9Wv83hYQSPdtBzuYAAAAASUVORK5CYII=",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAJ1BMVEXkAIDkAIDjAHriAHXkAID////86fHtea72vNX63urzqMn4zN7nM414wKpEAAAAAnRSTlO8A6fqfTYAAADPSURBVDiNtZPJEgMhCEQNIODy/98bUcelKs7kkPShpxjfAVpxL0c3ci93e16Ih/NC/AaAqa0agEwh5Vl0AJKfElyKBBVAXv5FA0KV94wXkIjYK1EDBKviCmAxRexA7Q42AAyArwG0GVGPwNAG+AsIy0htTOr5dcM91wrg1FZ1ACRMZYj2YTaXU5I+SOStSU7lPqpVwOYsQZ6TRAsK0zGH9lJAjkCGfA8EYmuCD0la955VbZgGQNQIxQRAi4kO5StJy3QYfHi0f16cx+V9Wv83hYQSPdtBzuYAAAAASUVORK5CYII=",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAJ1BMVEXkAIDkAIDjAHriAHXkAID////86fHtea72vNX63urzqMn4zN7nM414wKpEAAAAAnRSTlO8A6fqfTYAAADPSURBVDiNtZPJEgMhCEQNIODy/98bUcelKs7kkPShpxjfAVpxL0c3ci93e16Ih/NC/AaAqa0agEwh5Vl0AJKfElyKBBVAXv5FA0KV94wXkIjYK1EDBKviCmAxRexA7Q42AAyArwG0GVGPwNAG+AsIy0htTOr5dcM91wrg1FZ1ACRMZYj2YTaXU5I+SOStSU7lPqpVwOYsQZ6TRAsK0zGH9lJAjkCGfA8EYmuCD0la955VbZgGQNQIxQRAi4kO5StJy3QYfHi0f16cx+V9Wv83hYQSPdtBzuYAAAAASUVORK5CYII="
    ];
    const selectedPlatform = ref(0);

    // 記錄使用者在表單輸入的值
    const installment = ref(false);
    const installmentTimes = ref(null);
    const total = ref(null);
    const date = ref(null);
    const onlyMyCard = ref(null);

    // 準備試算標籤列表，和一個用來記錄當前選定標籤的變數
    const calculateResultTags = [
        "現金折扣",
        "刷卡金回饋",
        "購物平台回饋",
        "其他回饋"
    ];
    const selectedTag = ref(0);

    const rankingCards = [
        {
            ranking: 1,
            name: '某一張卡',
            src: 'https://images.contentstack.io/v3/assets/blt4ca32b8be67c85f8/blt93e64887e1209558/613b200cab64c62537a81256/Fotoram.io_(3).png?width=256&disable=upscale&fit=bounds&auto=webp',
            desc: '我只是個範例，沒有真的算過，誒嘿'
        },
        {
            ranking: 2,
            name: '某一張卡',
            src: 'https://images.contentstack.io/v3/assets/blt4ca32b8be67c85f8/blt93e64887e1209558/613b200cab64c62537a81256/Fotoram.io_(3).png?width=256&disable=upscale&fit=bounds&auto=webp',
            desc: '我只是個範例，沒有真的算過，誒嘿'
        },
        {
            ranking: 3,
            name: '某一張卡',
            src: 'https://images.contentstack.io/v3/assets/blt4ca32b8be67c85f8/blt93e64887e1209558/613b200cab64c62537a81256/Fotoram.io_(3).png?width=256&disable=upscale&fit=bounds&auto=webp',
            desc: '我只是個範例，沒有真的算過，誒嘿'
        }
    ];

</script>

<template>

    <div class="platform">
        <span>請選擇欲消費之網站：</span>
        <ul>
            <li v-for="(img, index) in platforms">
                <img @click="selectedPlatform = index" :src="img" alt="" :class="{ platformSelected: selectedPlatform == index }">
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
            <input v-model="installmentTimes" type="number" class="conditionField" placeholder="請輸入分期期數">
        </li>
        
        <li>
            <span class="conditionTitle">消費總額</span>
            <input v-model="total" type="number" class="conditionField" placeholder="請輸入本次消費總金額">
        </li>
        
        <li>
            <span class="conditionTitle">消費日期</span>
            <input v-model="date" type="date" class="conditionField">
        </li>

        <li class="onlyMyCard">
            <label v-if="userStore.account">
                <input v-model="onlyMyCard" type="checkbox">
                只顯示我已收藏的卡片
            </label>
        </li>

        <li class="calStart">
            <button type="button">開始試算</button>
        </li>

    </ul>

    <Tags :types="calculateResultTags" :selectedTag="selectedTag"></Tags>
    
    <CardRanking :cards="rankingCards"></CardRanking>

</template>

<style lang="less" scoped>

    .platform {
        position: relative;

        span {
            color: gray;
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

        .onlyMyCard {
            margin: 20px;
            text-align: center;
            label {
                display: block;
                margin: auto;
                height: 40px;
                line-height: 40px;
            }
        }

        .calStart {
            button {
                display: block;
                margin: auto;
                width: 180px;
                height: 100%;
                color: gray;
                font-size: 16px;
                border: 1px solid gray;
                border-radius: 15px;
                background-color: white;
            }
        }

    }

</style>