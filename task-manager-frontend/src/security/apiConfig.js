// src/security/apiConfig.js

//Configure the Basic Auth header
const username = 'user';
const password = 'password';
const token = btoa(`${username}:${password}`);

const config = {
    headers: {
        'Authorization': `Basic ${token}`
    }
};

export default config;