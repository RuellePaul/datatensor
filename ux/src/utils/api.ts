import axios from 'axios';
import Cookies from 'js-cookie';

const API_URI = `https://${window.location.hostname}/api`;

const api = axios.create({
    withCredentials: true,
    baseURL: API_URI,
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': Cookies.get('csrf_token')
    }
});

api.defaults.withCredentials = true;

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.data?.errorData === 'ERR_CSRF') {
            return api.request({
                ...error.config,
                headers: {
                    ...error.config.headers,
                    'X-CSRF-Token': Cookies.get('csrf_token')
                }
            })
        }

        return Promise.reject((error.response && error.response.data) || 'Something went wrong')
    }
);

export default api;
