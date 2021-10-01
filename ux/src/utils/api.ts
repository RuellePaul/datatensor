import axios from 'axios';

const PREFIX = '/api/v2';

export const API_HOSTNAME =
    process.env.REACT_APP_ENVIRONMENT === 'development'
        ? '127.0.0.1:4069'
        : window.location.hostname;

const API_URI =
    process.env.REACT_APP_ENVIRONMENT === 'development'
        ? `http://${API_HOSTNAME}${PREFIX}`
        : `https://${API_HOSTNAME}${PREFIX}`;

const api = axios.create({
    withCredentials: true,
    baseURL: API_URI,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.defaults.withCredentials = true;

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.data?.data === 'ERR_VERIFY') {
            if (window.location.pathname !== '/email-confirmation')
                window.location.replace('/email-confirmation');
        }

        if (error.response?.data?.data === 'ERR_EXPIRED') {
            window.location.href = '/login?expired';
        }

        return Promise.reject(
            (error.response && error.response.data) || 'Something went wrong'
        );
    }
);

export default api;
