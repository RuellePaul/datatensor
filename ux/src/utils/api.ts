import axios from 'axios';
import Cookies from 'js-cookie';

const API_URI = `http://${window.location.hostname}:4069`;

axios.defaults.withCredentials = true;

const api = axios.create({
    withCredentials: true,
    baseURL: API_URI,
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': Cookies.get('csrf_token')
    }
});

api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default api;
