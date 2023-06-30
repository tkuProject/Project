<script setup>

    const props = defineProps(["types", "selectedTag"]);

</script>

<template>

    <ul class="tags">
        <li v-for="(item, index) in types">
            <button @click="selectedTag = index" class="tag" :class="{ tagSelected: selectedTag == index }">{{ item }}</button>
        </li>
    </ul>

</template>

<style scoped>
    .tags {

        display: flex;
        align-items: flex-end;
        height: 60px;
        
        .tag {
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