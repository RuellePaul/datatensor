import AxiosMockAdapter from 'axios-mock-adapter';
import api from './api';

const axiosMockAdapter = new AxiosMockAdapter(api, {delayResponse: 0});

export default axiosMockAdapter;
