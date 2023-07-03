<script setup>

    const props = defineProps(['cards']);

</script>

<template>
    <table>
        <thead>
            <tr>
                <th class="tdRanking">名次</th>
                <th class="tdCard">卡片</th>
                <th class="tdDesc">試算過程與結果</th>
            </tr>
        </thead>
        <tr v-for="card in cards">
            <td class="tdRanking">{{ card.ranking }}</td>
            <td class="tdCard"><img :src="card.cardSrc" alt=""></td>
            <td class="tdDesc">{{ card.desc }}</td>
        </tr>
    </table>
</template>

<style lang="less" scoped>
    table {

        width: 100%;
        text-align: center;
        color: gray;
        background-color: white;
        border: 1px solid gray;
        border-collapse: collapse;

    th, td {
        font-weight: normal;
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

    .tdDesc {
        padding: 20px;
        width: 50%;
    }

}
</style>