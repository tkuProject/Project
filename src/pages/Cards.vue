<script setup>

    import { computed } from 'vue';
    import { useCardStore } from '../store/CardStore';
    import { useUserStore } from '../store/userStore';
    import sendReq from '../utils/sendReq';
    import CardPreview from '../components/CardPreview.vue';
    import infoOnImg from '../assets/images/小鈴鐺.svg';
    import infoOffImg from '../assets/images/小鈴鐺關閉.svg';

    const cardStore = useCardStore();
    const userStore = useUserStore();

    cardStore.collectionCards = computed(() => {
        return cardStore.allCards.filter(item => {
            if(userStore.collectionCards) {
                return userStore.collectionCards.includes(item.Card_No);
            }
        });
    });

    cardStore.otherCards = computed(() => {
        return cardStore.allCards.filter(item => {
            if(userStore.collectionCards) {
                return !(userStore.collectionCards.includes(item.Card_No));
            }
        });
    });

    const delFromCollection = async (cardNo) => {
        const { status } = await sendReq('delCollection',
        {
            header: { account: userStore.account },
            params: [cardNo]
        },
        'delete');
        if(status == 200) {
            alert('刪除成功！');
        } else {
            // 這個記得改
            alert('刪除失敗');
        }
        // 刷新userStore的collectionCards
        userStore.getCollectionCards;
        
        // 刪完得刷新才能看到，得修

    };
    const addToCollection = async (cardNo) => {
        const { status } = await sendReq('appendCollection',
        {
            header: { account: userStore.account },
            body: { Card_No: cardNo }
        },
        'post');
        if(status == 200) {
            alert('添加成功！');
        } else {
            // 這個記得改
            alert('添加失敗');
        }
        // 刷新userStore的collectionCards
        userStore.getCollectionCards();
    };

</script>

<template>
    
    <div class="search">
        <input type="search" placeholder="請輸入感興趣的卡片關鍵字">
        <button type="button"></button>
    </div>

    <template v-if="userStore.account">
        <span>您收藏的卡片：</span>
        <ul v-if="cardStore.collectionCards?.length >= 0">
            <li v-for="card in cardStore.collectionCards">
                <CardPreview :card="card">
                    <template #header v-if="userStore.account">
                        <button @click="card.infoOn=!card.infoOn" class="informBtn" :title="(card.infoOn?'關閉':'開啟') + '通知'" :style="{ backgroundImage: `url('` + (card.infoOn?infoOnImg:infoOffImg) + `')` }">
                        </button>
                        <button @click="delFromCollection(card.Card_No)" class="addAndDel delFromCollection" title="從您的收藏中刪除">×</button>
                    </template>
                </CardPreview>
            </li>
            <div v-if="cardStore.collectionCards.length==0" class="noCard">您目前沒有收藏卡片喔～</div>
        </ul>
        <div v-else>讀取中</div>
        <hr>
    </template>

    <span>{{ userStore.account?'其他卡片：':'卡片列表' }}</span>
    <ul v-if="(userStore.account?cardStore.otherCards:cardStore.allCards)?.length >= 0">
        <li v-for="card in userStore.account?cardStore.otherCards:cardStore.allCards">
            <CardPreview :card="card">
                <template #header v-if="userStore.account">
                    <button @click="card.infoOn=!card.infoOn" class="informBtn" :title="(card.infoOn?'關閉':'開啟') + '通知'" :style="{ backgroundImage: `url('` + (card.infoOn?infoOnImg:infoOffImg) + `')` }">
                    </button>
                    <button @click="addToCollection(card.Card_No)" class="addAndDel addToCollection" title="加入您的收藏">+</button>
                </template>
            </CardPreview>
        </li>
        <div v-if="(userStore.account?cardStore.otherCards:cardStore.allCards).length==0" class="noCard">目前沒有其他卡片喔～</div>
    </ul>
    <div v-else>讀取中</div>

</template>

<style lang="less" scoped>

    .search {
        position: relative;
        overflow: hidden;
        margin: 40px auto;
        margin-top: 0;
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