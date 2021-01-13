import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React, {FC} from 'react';
import {Router} from 'react-router-dom'
import {createBrowserHistory} from 'history';
import './assets/scss/index.scss';

import Routes from 'Routes';

const browserHistory = createBrowserHistory();

const App: FC = () => (
    <Router history={browserHistory}>
        <Routes/>
    </Router>
);

export default App;