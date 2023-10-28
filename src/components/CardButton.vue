<script setup>
  
    import { useUserStore } from '../store/userStore';
    import sendReq from '../utils/sendReq';

    const props = defineProps(['cardNo', 'textMode']);

    const userStore = useUserStore();

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

</script>

<template>

    <div class="cardHeader" :class="props.textMode ? 'centerButton' : ''">
        <button v-if="userStore.inCollection(props.cardNo)" @click="delFromCollection(props.cardNo)" class="addAndDel delFromCollection" :class="props.textMode ? 'biggerButton' : ''" title="從我的收藏中刪除">{{ props.textMode ? '移出收藏' : '×' }}</button>
        <button v-else @click="addToCollection(props.cardNo)" class="addAndDel addToCollection" :class="props.textMode ? 'biggerButton' : ''" title="加入我的收藏">{{ props.textMode ? '加入收藏' : '+' }}</button>
    </div>

</template>

<style lang="less" scoped>

    .cardHeader {
        display: flex;
        justify-content: flex-end;
        button {
            width: 20px;
            height: 20px;
        }
        .biggerButton {
            width: 80px;
            height: 30px;
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

    .centerButton {
        display: flex;
        justify-content: center;
    }

</style>