export default (path = '', options = {}, method = 'get') => {

    if(options.params) {
        for(item in options.params) {
            path += '/' + item;
        }
    }

    if(options.query) {
        path += '?';
        queryParams = [];
        for(key in Object.keys(query)) {
            queryParams.push(key + '=' + options.query.key);
        }
        path += queryParams.join('&');
    }

    if(options.body) {
        options.body = JSON.stringify(options.body);
    }

    return fetch('http://127.0.0.1:3001/ccc/' + path, {
        headers: {
            'Content-Type': 'application/json'
        },
        body: options.body,
        method
    }).then(res => res.json());

}