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
    }).then(res => res.json());

}