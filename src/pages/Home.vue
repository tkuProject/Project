<script setup>

    import { ref } from "vue";
    import Ranking from "../components/calculate/Ranking.vue";
    
    let selectedTag = ref(0);
    let calculateResultTags = [
        "現金折扣",
        "刷卡金回饋",
        "購物平台回饋",
        "其他回饋"
    ];

</script>

<template>

    <div class="platform">
        <span>請選擇欲消費之網站：</span>
        <button class="arrow leftArrow">&lt</button>
        <ul>
            <li><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAJ1BMVEXkAIDkAIDjAHriAHXkAID////86fHtea72vNX63urzqMn4zN7nM414wKpEAAAAAnRSTlO8A6fqfTYAAADPSURBVDiNtZPJEgMhCEQNIODy/98bUcelKs7kkPShpxjfAVpxL0c3ci93e16Ih/NC/AaAqa0agEwh5Vl0AJKfElyKBBVAXv5FA0KV94wXkIjYK1EDBKviCmAxRexA7Q42AAyArwG0GVGPwNAG+AsIy0htTOr5dcM91wrg1FZ1ACRMZYj2YTaXU5I+SOStSU7lPqpVwOYsQZ6TRAsK0zGH9lJAjkCGfA8EYmuCD0la955VbZgGQNQIxQRAi4kO5StJy3QYfHi0f16cx+V9Wv83hYQSPdtBzuYAAAAASUVORK5CYII=" alt="" class="edgeImg"></li>
            <li><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAJ1BMVEXkAIDkAIDjAHriAHXkAID////86fHtea72vNX63urzqMn4zN7nM414wKpEAAAAAnRSTlO8A6fqfTYAAADPSURBVDiNtZPJEgMhCEQNIODy/98bUcelKs7kkPShpxjfAVpxL0c3ci93e16Ih/NC/AaAqa0agEwh5Vl0AJKfElyKBBVAXv5FA0KV94wXkIjYK1EDBKviCmAxRexA7Q42AAyArwG0GVGPwNAG+AsIy0htTOr5dcM91wrg1FZ1ACRMZYj2YTaXU5I+SOStSU7lPqpVwOYsQZ6TRAsK0zGH9lJAjkCGfA8EYmuCD0la955VbZgGQNQIxQRAi4kO5StJy3QYfHi0f16cx+V9Wv83hYQSPdtBzuYAAAAASUVORK5CYII=" alt="" class="intermediateImg"></li>
            <li><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAJ1BMVEXkAIDkAIDjAHriAHXkAID////86fHtea72vNX63urzqMn4zN7nM414wKpEAAAAAnRSTlO8A6fqfTYAAADPSURBVDiNtZPJEgMhCEQNIODy/98bUcelKs7kkPShpxjfAVpxL0c3ci93e16Ih/NC/AaAqa0agEwh5Vl0AJKfElyKBBVAXv5FA0KV94wXkIjYK1EDBKviCmAxRexA7Q42AAyArwG0GVGPwNAG+AsIy0htTOr5dcM91wrg1FZ1ACRMZYj2YTaXU5I+SOStSU7lPqpVwOYsQZ6TRAsK0zGH9lJAjkCGfA8EYmuCD0la955VbZgGQNQIxQRAi4kO5StJy3QYfHi0f16cx+V9Wv83hYQSPdtBzuYAAAAASUVORK5CYII=" alt="" class="centerImg"></li>
            <li><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAJ1BMVEXkAIDkAIDjAHriAHXkAID////86fHtea72vNX63urzqMn4zN7nM414wKpEAAAAAnRSTlO8A6fqfTYAAADPSURBVDiNtZPJEgMhCEQNIODy/98bUcelKs7kkPShpxjfAVpxL0c3ci93e16Ih/NC/AaAqa0agEwh5Vl0AJKfElyKBBVAXv5FA0KV94wXkIjYK1EDBKviCmAxRexA7Q42AAyArwG0GVGPwNAG+AsIy0htTOr5dcM91wrg1FZ1ACRMZYj2YTaXU5I+SOStSU7lPqpVwOYsQZ6TRAsK0zGH9lJAjkCGfA8EYmuCD0la955VbZgGQNQIxQRAi4kO5StJy3QYfHi0f16cx+V9Wv83hYQSPdtBzuYAAAAASUVORK5CYII=" alt="" class="intermediateImg"></li>
            <li><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAJ1BMVEXkAIDkAIDjAHriAHXkAID////86fHtea72vNX63urzqMn4zN7nM414wKpEAAAAAnRSTlO8A6fqfTYAAADPSURBVDiNtZPJEgMhCEQNIODy/98bUcelKs7kkPShpxjfAVpxL0c3ci93e16Ih/NC/AaAqa0agEwh5Vl0AJKfElyKBBVAXv5FA0KV94wXkIjYK1EDBKviCmAxRexA7Q42AAyArwG0GVGPwNAG+AsIy0htTOr5dcM91wrg1FZ1ACRMZYj2YTaXU5I+SOStSU7lPqpVwOYsQZ6TRAsK0zGH9lJAjkCGfA8EYmuCD0la955VbZgGQNQIxQRAi4kO5StJy3QYfHi0f16cx+V9Wv83hYQSPdtBzuYAAAAASUVORK5CYII=" alt="" class="edgeImg"></li>
        </ul>
        <button class="arrow rightArrow">&gt</button>
    </div>

    <form action="" class="conditions">
        <span class="conditionTitle">是否分期</span>
        <div class="conditionField">
            <input type="radio" name="installmentOrNot" value="yes" id="yesInstallment">
            <label for="yesInstallment">有分期</label>
            <span>　</span>
            <input type="radio" name="installmentOrNot" value="no" id="noInstallment">
            <label for="yesInstallment">無分期</label>
        </div>
        
        <span class="conditionTitle">分期期數</span>
        <input type="number" name="installmentsTimes" id="installmentsTimes" class="conditionField" placeholder="請輸入分期期數">
        <br>
        <span class="conditionTitle">消費總額</span>
        <input type="number" name="total" id="total" class="conditionField" placeholder="請輸入本次消費總金額">
        <br>
        <span class="conditionTitle">消費日期</span>
        <input type="date" name="date" id="date" class="conditionField" placeholder="請選擇購買日期">

        <div class="onlyMyCard">
            <input type="checkbox" name="onlyMyCard" value="onlyMyCard" id="onlyMyCard"><label for="onlyMyCard"> 只顯示我已擁有的卡片</label>
        </div>

        <button type="button">開始試算</button>
    </form>

    <Ranking :types="calculateResultTags" :selectedTag="selectedTag"></Ranking>
    
    <table class="calculateResult">
        <tr>
            <td class="tdRanking">名次</td>
            <td class="tdCard">卡片</td>
            <td class="tdResult">試算過程與結果</td>
        </tr>
        <tr>
            <td class="tdRanking">1</td>
            <td class="tdCard"><img src="https://images.contentstack.io/v3/assets/blt4ca32b8be67c85f8/blt93e64887e1209558/613b200cab64c62537a81256/Fotoram.io_(3).png?width=256&disable=upscale&fit=bounds&auto=webp" alt=""></td>
            <td class="tdResult">我只是個範例，沒有真的算過，誒嘿</td>
        </tr>
    </table>

</template>

<style lang="less" scoped>

    .platform {
        position: relative;
        padding-top: 50px;
        padding-bottom: 30px;

        span {
            color: gray;
        }

        .arrow {
            top: 123px;
        }

        .leftArrow {
            left: 60px;
        }
        .rightArrow {
            right: 60px;
        }

        ul {
            display: flex;
            justify-content: space-around;
            align-items: center;
            margin: 40px auto;
            width: 400px;
            li {
                img {
                    border-radius: 12px;
                }
                .edgeImg {
                    width: 30px;
                    height: 30px;
                    opacity: .4;
                }
                .intermediateImg {
                    width: 40px;
                    height: 40px;
                    opacity: .8;
                }
                .centerImg {
                    width: 60px;
                    height: 60px;
                    opacity: 1.0;
                }
            }
        }

    }

    .conditions {

        overflow: hidden;
        margin-bottom: 50px;

        .conditionTitle {
            display: inline-block;
            float: left;
            width: 29%;
            height: 40px;
            text-align: center;
            line-height: 40px;
        background-color: rgba(255, 255, 255, .5);
            border: 1px solid gray;
        }

        .conditionField {
            display: inline-block;
            float: left;
            width: 70%;
            height: 40px;
            text-align: center;
            line-height: 40px;
        background-color: rgba(255, 255, 255, .5);
            border: 1px solid gray;
        }

        .onlyMyCard {
            float: left;
            width: 100%;
            height: 80px;
            text-align: center;
            line-height: 80px;
        }

        button {
            display: block;
            margin: auto;
            width: 180px;
            height: 30px;
            color: gray;
            font-size: 16px;
            border: 1px solid gray;
            border-radius: 15px;
            background-color: white;
        }

    }

    .calculateResult {

        width: 100%;
        text-align: center;
        background-color: white;
        border: 1px solid gray;
        border-collapse: collapse;

        td {
            border: 1px solid gray;
        }

        .tdRanking {
            width: 20%;
        }

        .tdCard {
            padding: 20px 0;
            width: 30%;
            img {
                width: 80%;
            }
        }

        .tdResult {
            padding: 20px;
            width: 50%;
        }

    }

</style>