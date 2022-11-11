import axios from 'axios';

const PREFIX = '/v2';

const ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT;

export const API_HOSTNAME = ENVIRONMENT === 'production' ? 'api.datatensor.io' : '127.0.0.1:4069';
export const WS_HOSTNAME = ENVIRONMENT === 'production' ? `wss://${API_HOSTNAME}/ws` : `ws://${API_HOSTNAME}/ws`;

export const API_URI =
    ENVIRONMENT === 'development' ? `http://${API_HOSTNAME}${PREFIX}` : `https://${API_HOSTNAME}${PREFIX}`;

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
            if (window.location.pathname !== '/email-confirmation') window.location.replace('/auth/email-confirmation');
        }

        if (error.response?.data?.data === 'ERR_EXPIRED') {
            if (window.location.pathname !== '/auth/login')
                window.location.href = '/auth/login?expired';
        }

        return Promise.reject((error.response && error.response.data) || 'Something went wrong');
    }
);

export default api;
