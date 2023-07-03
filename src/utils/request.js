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