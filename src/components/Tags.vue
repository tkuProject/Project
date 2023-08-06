<script setup>

    // 純emit
    // const props = defineProps(['types', 'selectedTag']);
    // const emit = defineEmits(['selectTag']);

    // v-model
    const props = defineProps(['types', 'modelValue']);
    const emit = defineEmits(['update:modelValue']);

</script>

<template>

    <ul class="tags">
        <li v-for="item in types">
            <!-- 純emit -->
            <!-- <button @click="emit('selectTag', item)" class="tag" :class="{ tagSelected: selectedTag == item }">{{ item }}</button> -->
            <!-- v-model -->
            <button @click="emit('update:modelValue', item)" class="tag" :class="{ tagSelected: modelValue == item }">{{ item }}</button>
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