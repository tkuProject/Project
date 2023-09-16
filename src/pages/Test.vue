<script setup>

    import { ref, reactive } from 'vue';
    import request from '../utils/request.js';

    const backendPath = 'emps';
    const data = ref([]);

    const getData = () => {
        request(backendPath).then(json => {
            data.value = json.data;
        });
    }
    getData();

    const format = {
        name: '姓名',
        gender: '性別',
        position: '職位'
    }

    const dataToAdd = reactive({});
    const resetData = (data) => {
        Object.keys(format).forEach(key => {
            data[key] = '';
        })
    }
    resetData(dataToAdd);
    
    const addData = async () => {
        // 送請求給後端
        const { status, msg } = await request(backendPath, {
            method: 'post',
            body: dataToAdd
        });
        if(status) {
            // 刷新前端資料
            getData();
            // 重置input
            resetData(dataToAdd);
        } else {
            console.log(msg);
        }
    };
    
    const editingData = reactive({});
    const editData = async () => {
        const {id, ...others} = editingData;
        const {status, msg} = await request(backendPath + '/' + id, {
            method: 'put',
            body: others
        });
        if(status) {
            // 刷新畫面
            getData();
            // 撤掉編輯模式
            editingData.id = undefined;
        } else {
            console.log(msg);
        }
    };

    const delData = async (id) => {
        const {status, msg} = await request(backendPath + '/' + id, {
            method: 'delete'
        });
        if(status) {
            // 刷新畫面
            getData();
        } else {
            console.log(msg);
        }
    };

</script>

<template>
    <table>
        <thead>
            <tr>
                <th v-for="field in Object.values(format)">{{ field }}</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in data">
                <td v-for="key in Object.keys(format)">
                    <template v-if="editingData.id != item.id">{{ item[key] }}</template>
                    <input v-else v-model="editingData[key]" type="text">
                </td>
                <td v-if="editingData.id != item.id">
                    <button @click="editingData.id = item.id; resetData(editingData)">編輯</button>
                    <button @click="delData(item.id)">刪除</button>
                </td>
                <td v-else>
                    <button @click="editingData.id = undefined">取消</button>
                    <button @click="editData">確認</button>
                </td>
            </tr>
            <tr>
                <td v-for="key in Object.keys(dataToAdd)">
                    <input type="text" v-model="dataToAdd[key]">
                </td>
                <td>
                    <button @click="addData">新增</button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<style lang="less" scoped>

    table {
        margin: 50px 0;
        width: 100%;
        color: gray;
        background-color: rgba(255, 255, 255, .5);
        border: 1px solid gray;
        border-collapse: collapse;
        tr {
            display: flex;
            th, td {
                display: flex;
                justify-content: center;
                align-items: center;
                flex: 1 0;
                padding: 10px 0;
                text-align: center;
                border: 1px solid gray;
                button {
                    margin: auto 10px;
                    padding: 2px 6px;
                    color: gray;
                    background-color: rgba(255, 255, 255, .7);
                    border: 1px solid gray;
                    border-radius: 12px;
                    &:hover {
                        background-color: rgba(255, 255, 255, 1);
                    }
                }
                input {
                    display: inline-block;
                    padding: 4px 6px;
                    width: 80%;
                    height: 24px;
                }
            }
            th {
                background-color: rgba(255, 255, 255, .7);
            }
        }
    }

</style>