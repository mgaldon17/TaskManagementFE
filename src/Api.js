// src/api.js

import axios from 'axios';
import API_HEADERS from "./security/apiConfig";


const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    headers: API_HEADERS
});

export default axiosInstance;