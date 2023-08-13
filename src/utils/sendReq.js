export default (path = '', options = {}, method = 'get') => {

    if(!options.headers) {
        options.headers = {};
    }
    options.headers['Content-Type'] = 'application/json';

    if(options.params) {
        for(let item of options.params) {
            path += '/' + item;
        }
    }

    if(options.query) {
        path += '?';
        const queryParams = [];
        for(let key of Object.keys(options.query)) {
            queryParams.push(key + '=' + options.query[key]);
        }
        path += queryParams.join('&');
    }

    if(options.body) {
        options.body = JSON.stringify(options.body);
    }

    return fetch('http://127.0.0.1:3001/ccc/' + path, {
        headers: options.headers,
        body: options.body,
        method
    }).then(res => {
        return res.json();
        /*if(res.status == 200) {
            return res.json();
        } else {
            // 之後再討論真的遇到其他情況要怎麼做
            console.log(path + '請求失敗');
        }*/
    });

}