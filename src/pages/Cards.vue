<script setup>

    import { reactive } from 'vue';
    import CardPreview from '../components/CardPreview.vue';
    import infoOnImg from '../assets/images/小鈴鐺.svg';
    import infoOffImg from '../assets/images/小鈴鐺關閉.svg';

    const collectionCards = reactive([]);
    const otherCards = reactive([]);

    // ↓塞點假的卡片，示意用，記得刪
    const numOfMyCard = 6;
    for(let i=0; i<numOfMyCard; i++) {
        collectionCards.push({
            cardId: i,
            src: 'https://images.contentstack.io/v3/assets/blt4ca32b8be67c85f8/blt93e64887e1209558/613b200cab64c62537a81256/Fotoram.io_(3).png?width=256&disable=upscale&fit=bounds&auto=webp',
            name: '哇卡卡卡卡',
            infoOn: false
        });
    }
    for(let i=0; i<15; i++) {
        otherCards.push({
            cardId: i + numOfMyCard,
            src: 'https://images.contentstack.io/v3/assets/blt4ca32b8be67c85f8/blt93e64887e1209558/613b200cab64c62537a81256/Fotoram.io_(3).png?width=256&disable=upscale&fit=bounds&auto=webp',
            name: '哇卡卡卡卡',
            infoOn: false
        });
    }

    // 能連上資料庫之後記得大改這兩個
    const delFromCollection = (id) => {
        const cardIndex = collectionCards.indexOf(collectionCards.find(item => item.cardId==id));
        if(cardIndex != -1) {
            otherCards.push(collectionCards.splice(cardIndex, 1)[0]);
        }
    };
    const addToCollection = (id) => {
        const cardIndex = otherCards.indexOf(otherCards.find(item => item.cardId==id));
        if(cardIndex != -1) {
            collectionCards.push(otherCards.splice(cardIndex, 1)[0]);
        }
    };

</script>

<template>
    
    <div class="search">
        <input type="search" placeholder="請輸入感興趣的卡片關鍵字">
        <button type="button"></button>
    </div>

    <span>您收藏的卡片：</span>
    <ul>
        <li v-for="card in collectionCards">
            <CardPreview :card="card">
                <template #header>
                    <button @click="card.infoOn=!card.infoOn" class="informBtn" :title="(card.infoOn?'關閉':'開啟') + '通知'" :style="{ backgroundImage: `url('` + (card.infoOn?infoOnImg:infoOffImg) + `')` }">
                    </button>
                    <button @click="delFromCollection(card.cardId)" class="addAndDel delFromCollection" title="從您的收藏中刪除">×</button>
                </template>
            </CardPreview>
        </li>
        <div v-if="collectionCards.length==0" class="noCard">您目前沒有收藏卡片喔～</div>
    </ul>

    <hr>

    <span>其他卡片：</span>
    <ul>
        <li v-for="card in otherCards">
            <CardPreview :card="card">
                <template #header>
                    <button @click="card.infoOn=!card.infoOn" class="informBtn" :title="(card.infoOn?'關閉':'開啟') + '通知'" :style="{ backgroundImage: `url('` + (card.infoOn?infoOnImg:infoOffImg) + `')` }">
                    </button>
                    <button @click="addToCollection(card.cardId)" class="addAndDel addToCollection" title="加入您的收藏">+</button>
                </template>
            </CardPreview>
        </li>
        <div v-if="otherCards.length==0" class="noCard">目前沒有其他卡片喔～</div>
    </ul>

</template>

<style lang="less" scoped>

    .search {
        position: relative;
        overflow: hidden;
        margin: 40px auto;
        width: 400px;
        height: 40px;
        background-color: white;
        border: none;
        border-radius: 12px;
        input {
            position: absolute;
            padding-left: 14px;
            width: 90%;
            height: 100%;
            border: none;
            outline: none;
        }
        button {
            position: absolute;
            right: 0;
            width: 10%;
            height: 100%;
            background: url('../assets/images/放大鏡.svg') no-repeat center;
            background-size: 40%;
            border: none;
        }
    }

    hr {
        margin: 40px;
        border: 1px solid gray;
    }

    ul {
        display: flex;
        flex-wrap: wrap;
        margin-top: 20px;
        li {
            margin: 20px 15px 0 15px;
            width: 20%;
            button {
                margin-bottom: 16px;
                width: 20px;
                height: 20px;
            }
            .informBtn {
                background: no-repeat center;
                background-size: 90%;
                border: none;
            }
            .addAndDel {
                float: right;
                color: gray;
                background: none;
                border: 1.5px solid gray;
                border-radius: 6px;
            }
            .delFromCollection {
                &:hover {
                    color: white;
                    background-color: red;
                }
            }
            .addToCollection {
                &:hover {
                    color: white;
                    background-color: #009DBF;
                }
            }
        }
        .noCard {
            margin: 40px auto;
            font-size: 30px;
            color: gray;
        }
    }

</style>