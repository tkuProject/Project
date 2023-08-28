<script setup>

    import { computed, reactive, ref } from 'vue';
    import { useCardStore } from '../store/CardStore';
    import { useUserStore } from '../store/userStore';
    import sendReq from '../utils/sendReq';
    import CardPreview from '../components/CardPreview.vue';
    // import infoOnImg from '../assets/images/小鈴鐺.svg';
    // import infoOffImg from '../assets/images/小鈴鐺關閉.svg';

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
            // 這個記得改
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
            // 這個記得改
            alert('添加失敗');
        }
        // 刷新userStore的collectionCards
        await userStore.getCollectionCards();
    };

    /*
    const notiOnCards = reactive([]);
    const getNotiOnCards = async () => {
        await sendReq('notiCards', {
            headers: {
                account: userStore.account
            }
        }).then(json => {
            if(json.status == 200) {
                notiOnCards.length = 0;
                notiOnCards.push(...json.cardNo);
            }
        })
    };
    getNotiOnCards();

    const turnOnNoti = async cardNo => {
        await sendReq('notiOn', {
            headers: { account: userStore.account },
            body: { Card_No: cardNo }
        }, 'post').then(json => {
            if(json.status == 200) {
                alert('成功開啟通知！');
            } else {
                alert('未能成功開啟通知');
            }
        });
        getNotiOnCards();
    };

    const turnOffNoti = async cardNo => {
        await sendReq('notiOff', {
            headers: { account: userStore.account },
            params: [cardNo]
        }, 'delete').then(json => {
            if(json.status == 200) {
                alert('成功關閉通知！');
            } else {
                alert('未能成功關閉通知');
            }
        });
        getNotiOnCards();
    };
    */

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
                keyNos.push(...json.cardNos);
                keywordToShow = keyIn.value;
                searchingMode.value = true;
            }
        });
    }

</script>

<template>
    
    <div class="search">
        <input v-model="keyIn" type="search" placeholder="請輸入感興趣的卡片關鍵字">
        <button @click="search" class="searchBtn" type="button"></button>
    </div>
    <button @click="searchingMode = false" v-if="searchingMode" class="goBack">返回</button>

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
                            <!-- <button v-if="notiOnCards.includes(card.Card_No)" @click="turnOffNoti(card.Card_No)" class="informBtn" title="關閉通知" :style="{ backgroundImage: `url('` + (infoOffImg) + `')` }">
                            </button>
                            <button v-else @click="turnOnNoti(card.Card_No)" class="informBtn" title="開啟通知" :style="{ backgroundImage: `url('` + (infoOnImg) + `')` }">
                            </button> -->
                            <button @click="delFromCollection(card.Card_No)" class="addAndDel delFromCollection" title="從您的收藏中刪除">×</button>
                        </template>
                    </CardPreview>
                </li>
            </template>
            <div v-if="collectionCards.length==0" class="noCard">目前沒有收藏卡片喔～</div>
            <div v-if="searchingMode && !collectionCards.some(item => keyNos.includes(item.Card_No))" class="noCard">沒有相關的卡片</div>
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
                        <!-- <button v-if="notiOnCards?.includes(card.Card_No)" @click="turnOffNoti(card.Card_No)" class="informBtn" title="關閉通知" :style="{ backgroundImage: `url('` + (infoOffImg) + `')` }">
                        </button>
                        <button v-else @click="turnOnNoti(card.Card_No)" class="informBtn" title="開啟通知" :style="{ backgroundImage: `url('` + (infoOnImg) + `')` }">
                        </button> -->
                        <button @click="addToCollection(card.Card_No)" class="addAndDel addToCollection" title="加入您的收藏">+</button>
                    </template>
                </CardPreview>
            </li>
        </template>
        <div v-if="(userStore.account?otherCards:cardStore.allCards).length==0" class="noCard">目前沒有其他卡片喔～</div>
        <div v-if="searchingMode && !otherCards.some(item => keyNos.includes(item.Card_No))" class="noCard">沒有相關的卡片</div>
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
        width: 80px;
        height: 40px;
        text-align: right;
        font-size: 20px;
        background: url(../assets/images/goBack.svg) no-repeat center left;
        background-size: 30%;
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
            margin: 0 15px 0 15px;
            width: 20%;
            button {
                margin-bottom: 16px;
                width: 20px;
                height: 20px;
            }
            /*
            .informBtn {
                background: no-repeat center;
                background-size: 90%;
                border: none;
            }
            */
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