import AxiosMockAdapter from 'axios-mock-adapter';
import axios from './api';

const axiosMockAdapter = new AxiosMockAdapter(axios, {delayResponse: 0});

export default axiosMockAdapter;
