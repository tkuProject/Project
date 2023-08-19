<script setup>

    import { ref, reactive } from 'vue';
    import { useUserStore } from '../store/userStore';
    import sendReq from '../utils/sendReq';

    const userStore = useUserStore();

    const notiOnCards = reactive([]);
    const getNotiOnCards = async () => {
        await sendReq('notiCards', {
            headers: {
                account: userStore.account
            }
        }).then(json => {
            if(json.status == 200) {
                notiOnCards.length = 0;
                notiOnCards.push(...json.notiOnCards);
            }
        })
    };
    getNotiOnCards();

    const notis = reactive([]);
    const getNotis = async () => {
        await sendReq('notiAll', {
            headers: { account: userStore.account }
        }).then(json => {
            if(json.status == 200) {
                notis.length = 0;
                notis.push(...json.notifications);
            }
        });
    };
    getNotis();

    const collectionOnlyActivated = ref(false);
    const cardFilterActivated = ref(false);

</script>

<template>

    <ul class="linkUl">
        <li v-for="item in notis">
            <img :src="item.src" alt="">
            <div class="desc">
                <div class="cardName">{{ item.cardName }}</div>
                <div class="description">{{ item.desc }}</div>
                <div class="bottomWrapper">
                    <div class="dateTime">{{ item.dateTime }}</div>
                    <button @click="item.notiOn=!item.notiOn">{{ item.notiOn?'移出收藏':'收藏' }}</button>
                </div>
            </div>
        </li>
    </ul>

    <div class="filter">
        <button @click="collectionOnlyActivated = !collectionOnlyActivated" :class="{activated: collectionOnlyActivated}" class="filterType collectionOnly" title="只顯示已收藏的通知">收藏</button>
        <button @click="cardFilterActivated = !cardFilterActivated" :class="{activated: cardFilterActivated}" class="filterType cardFilter" title="只顯示勾選卡片的通知">篩選</button>
        <template v-if="cardFilterActivated">
            <ul class="filterCards">
                <li class="ulHint">已開啟通知的卡片：</li>
                <div class="cardsWrapper scrollBox">
                    <li v-for="card in notiOnCards" class="cardOptLi">
                        <label>
                            <input type="checkbox" name="showableCard">
                            <img :src="card.src" alt="">
                            <span>{{ card.name }}</span>
                        </label>
                    </li>
                </div>
            </ul>
            <div class="horn"></div>
        </template>
        
    </div>

</template>

<style lang="less" scoped>

    .linkUl {
        display: inline-block;
        margin-left: 80px;
        width: 520px;
        background-color: white;
        border: 1px solid gray;
        border-radius: 12px;
        overflow: hidden;
        li {
            display: flex;
            align-items: center;
            justify-content: space-around;
            background-color: white;
            border-bottom: 1px solid gray;
            cursor: pointer;
            &:hover {
                background-color: rgba(211, 211, 211, .3);
            }
            img {
                margin: 30px;
                width: 120px;
            }
            .desc {
                display: flex;
                flex-direction: column;
                margin-right: 30px;
                line-height: 1.5;
                .cardName {
                    color: black;
                }
                .description {
                    color: #009DBF;
                }
                .bottomWrapper {
                    display: flex;
                    justify-content: space-between;
                    .dateTime {
                        color: gray;
                    }
                    button {
                        width: 80px;
                    }
                }
            }
        }
    }

    .filter {
        position: fixed;
        top: 130px;
        display: flex;
        flex-direction: column;
        margin-right: 20px;
        width: 60px;
        .filterType {
            margin: 0 20px 20px 0;
            width: 100%;
            height: 60px;
            font-size: 18px;
        }
        .activated {
            color: #009DBF;
            border-color: #009DBF;
        }
        .filterCards {
            position: relative;
            left: 4px;
            width: 300px;
            background-color: white;
            border: 1px solid gray;
            box-shadow: 0 4px 4px rgba(128, 128, 128, .5);
            .ulHint {
                height: 40px;
                line-height: 40px;
                text-indent: 1em;
                color: gray;
                box-shadow: 0 0 4px gray;
            }
            .cardsWrapper {
                height: 220px;
            }
            .cardOptLi {
                padding: 20px;
                border-bottom: 1px solid gray;
                &:hover {
                    background-color: rgba(211, 211, 211, .3);
                }
                label {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 240px;
                    img {
                        width: 80px;
                    }
                    span {
                        width: 40%;
                    }
                }
            }
        }
        .horn {
            position: absolute;
            top: 150px;
            left: 20px;
            width: 20px;
            height: 20px;
            background-image: linear-gradient(to right bottom, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0) 50%);
            border-top: 1px solid gray;
            border-left: 1px solid gray;
            transform: rotate(45deg);
        }
    }

</style>