<script setup>

    const props = defineProps(["types", "selectedTag"]);

</script>

<template>

    <ul class="CRTags">
        <li v-for="(item, index) in types">
            <button @click="selectedTag = index" class="calculateResultTag" :class="{ tagSelected: selectedTag == index }">{{ item }}</button>
        </li>
    </ul>

</template>

<style scoped>
    .CRTags {

        display: flex;
        align-items: flex-end;
        height: 60px;
        
        .calculateResultTag {
            transition: .2s;
            width: 100px;
            height: 40px;
            color: white;
            border: 1px solid gray;
            border-bottom: 0;
            border-radius: 20px 20px 0 0;
            background-color: #81D9EC;
        }

        .tagSelected {
            width: 130px;
            height: 60px;
            color: gray;
            background-color: white;
        }

    }
</style>