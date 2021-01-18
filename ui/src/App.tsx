import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React, {FC} from 'react';
import {Router} from 'react-router-dom'
import {createBrowserHistory} from 'history';
import './assets/scss/index.scss';

import Providers from 'Providers';
import Routes from 'Routes';

const browserHistory = createBrowserHistory();

const App: FC = () => (
    <Providers>
        <Router history={browserHistory}>
            <Routes/>
        </Router>
    </Providers>
);

export default App;