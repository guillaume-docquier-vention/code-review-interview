const get = (url, callback) => {
    return fetch(url).then(response => response.json().then(callback));
}

const post = (url, body, callback) => {
    return fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: body
    }).then(callback);
}

export const HttpClient = {
    get,
    post
}