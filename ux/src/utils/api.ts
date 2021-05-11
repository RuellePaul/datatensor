import axios from 'axios';
import Cookies from 'js-cookie';

const PREFIX = '/api/v2';

const API_URI = process.env.REACT_APP_ENVIRONMENT === 'development'
    ? `https://${window.location.hostname}:7069${PREFIX}`
    : `https://${window.location.hostname}${PREFIX}`;

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

        if (error.response?.data?.errorData === 'ERR_VERIFY') {
            if (window.location.pathname !== '/email-confirmation')
                window.location.replace('/email-confirmation')
        }

        return Promise.reject((error.response && error.response.data) || 'Something went wrong')
    }
);

export default api;
