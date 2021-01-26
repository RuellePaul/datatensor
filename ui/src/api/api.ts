import axios from 'axios';
import Cookies from 'js-cookie'

const API_URL = `https://${window.location.hostname}:7069/v1/`;

axios.defaults.withCredentials = true;

const api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': Cookies.get('csrf_token')
    }
});

api.interceptors.response.use(response => response, error => {
    if (error.response?.data?.errorCode === 'expired_authentication')
        window.location.href = '/logout';

    if (error.response?.data?.errorData === 'ERR_CSRF')
        window.location.reload();

    return Promise.reject(error);
});

export default api;