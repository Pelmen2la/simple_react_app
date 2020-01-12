export default {
    doRequest,
    doDataRequest
}

async function doRequest(url, opts) {
    return new Promise(resolve => {
        fetch(url, opts).then(function(resp) {
            return resp.json();
        }).then(function(data) {
            resolve(data);
        });
    });
};

async function doDataRequest(url, method, data) {
    var opts = {
        method: method,
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    return await doRequest(url, opts);
};