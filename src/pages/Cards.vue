<script setup>

    import { computed, reactive, ref } from 'vue';
    import { useCardStore } from '../store/cardStore';
    import { useUserStore } from '../store/userStore';
    import sendReq from '../utils/sendReq';
    import CardPreview from '../components/CardPreview.vue';

    const cardStore = useCardStore();
    const userStore = useUserStore();

    const collectionCards = computed(() => {
        return cardStore.allCards.filter(item => {
            if(userStore.collectionCards) {
                return userStore.collectionCards.includes(item.Card_No);
            }
        });
    });

    const otherCards = computed(() => {
        return cardStore.allCards.filter(item => {
            if(userStore.collectionCards) {
                return !(userStore.collectionCards.includes(item.Card_No));
            }
        });
    });

    const delFromCollection = async (cardNo) => {
        const { status } = await sendReq('delCollection',
        {
            headers: { account: userStore.account },
            params: [cardNo]
        },
        'delete');
        if(status == 200) {
            alert('刪除成功！');
        } else {
            alert('刪除失敗');
        }
        // 刷新userStore的collectionCards
        await userStore.getCollectionCards();
    };
    const addToCollection = async (cardNo) => {
        const { status } = await sendReq('appendCollection',
        {
            headers: { account: userStore.account },
            body: { Card_No: cardNo }
        },
        'post');
        if(status == 200) {
            alert('添加成功！');
        } else {
            alert('添加失敗');
        }
        // 刷新userStore的collectionCards
        await userStore.getCollectionCards();
    };

    const searchingMode = ref(false);
    const keyIn = ref('');
    let keywordToShow;
    const keyNos = reactive([]);
    const search = () => {
        sendReq('searchCards', {
            query: {
                keyIn: keyIn.value
            }
        }).then(json => {
            if(json.status == 200) {
                keyNos.length = 0;
                keyNos.push(...cardStore.allCards.reduce((res, card) => {
                    if(card.discount_information?.includes(keyIn.value)) {
                        res.push(card.Card_No);
                    }
                    return res;
                }, []));
                keyNos.push(...json.cardNos);
                keywordToShow = keyIn.value;
                searchingMode.value = true;
            } else {
                alert('操作失敗，請稍後重試');
            }
        });
    }

</script>

<template>
    
    <div class="search">
        <input v-model="keyIn" type="search" placeholder="請輸入感興趣的卡片關鍵字">
        <button @click="search" class="searchBtn" type="button"></button>
    </div>
    <button @click="searchingMode = false" v-if="searchingMode" class="goBack">返回總覽</button>

    <div v-if="searchingMode" class="searchHint">
        與 {{ keywordToShow }} 相關的卡片：
    </div>

    <template v-if="userStore.account">
        <span>我收藏的卡片：</span>
        <ul v-if="collectionCards?.length >= 0">
            <template v-for="card in collectionCards">
                <li v-if="searchingMode ? keyNos.includes(card?.Card_No) : true">
                    <CardPreview :card="card">
                        <template #header v-if="userStore.account">
                            <div class="cardHeader">
                                <button @click="delFromCollection(card.Card_No)" class="addAndDel delFromCollection" title="從您的收藏中刪除">×</button>
                            </div>
                        </template>
                    </CardPreview>
                </li>
            </template>
            <div v-if="collectionCards.length==0" class="nothingHint">目前沒有收藏卡片喔～</div>
            <div v-if="searchingMode && !collectionCards.some(item => keyNos.includes(item.Card_No))" class="nothingHint">沒有相關的卡片</div>
        </ul>
        <div v-else>讀取中</div>
        <hr>
    </template>

    <span>{{ userStore.account?'其他卡片：':'卡片列表' }}</span>
    <ul v-if="(userStore.account?otherCards:cardStore.allCards)?.length >= 0">
        <template v-for="card in userStore.account?otherCards:cardStore.allCards">
            <li v-if="searchingMode ? keyNos.includes(card?.Card_No) : true">
                <CardPreview :card="card">
                    <template #header v-if="userStore.account">
                        <div class="cardHeader">
                            <button @click="addToCollection(card.Card_No)" class="addAndDel addToCollection" title="加入您的收藏">+</button>
                        </div>
                    </template>
                </CardPreview>
            </li>
        </template>
        <div v-if="(userStore.account?otherCards:cardStore.allCards).length==0" class="nothingHint">目前沒有其他卡片喔～</div>
        <div v-if="searchingMode && !otherCards.some(item => keyNos.includes(item.Card_No))" class="nothingHint">沒有相關的卡片</div>
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
            border: none;
            right: 0;
            width: 10%;
            height: 100%;
            background: url('../assets/images/放大鏡.svg') no-repeat center;
            background-size: 40%;
        }
    }
    .goBack {
        position: absolute;
        top: 80px;
        width: 100px;
        height: 40px;
        text-align: right;
        font-size: 20px;
        background: url(../assets/images/goBack.svg) no-repeat center left;
        background-size: 16%;
        border: none;
        &:hover {
            color: #009DBF;
            background-image: url(../assets/images/goBackHover.svg);
        }
    }

    .searchHint {
        margin: 50px 0;
        text-align: center;
        font-size: 20px;
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
            margin: 15px;
            width: 20%;
            .cardHeader {
                display: flex;
                justify-content: flex-end;
                padding: 10px;
                background-color: rgba(129, 217, 236, .3);
                button {
                    width: 20px;
                    height: 20px;
                }
                .addAndDel {
                    color: gray;
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
        }
    }

</style>