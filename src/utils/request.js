// 給Test.vue測試用的文件

import { ref } from "vue";

export default (path, options = {}) => {
    if(options.body) {
        options.body = JSON.stringify(options.body);
    }
    if(!options.headers) {
        options.headers = {};
    }
    options.headers['Content-Type'] = 'application/json';

    return fetch('http://127.0.0.1:3001/' + path, options).then(res => res.json());
}

/*
const bigRequest = (api) => {
    const data = ref(null);
    api().then(res => {
        data.value = res;
    });
    return data;
};
*/