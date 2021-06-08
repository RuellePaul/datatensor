import React, {FC} from 'react';
import {Router} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import GlobalStyles from 'src/components/utils/GlobalStyles';
import ScrollReset from 'src/components/utils/ScrollReset';
import CookiesNotification from 'src/components/overlays/CookiesNotification';
import SettingsNotification from 'src/components/overlays/SettingsNotification';
import {AuthProvider} from 'src/store/AuthContext';
import routes, {renderRoutes} from 'src/routes';
import Providers from './providers';

const history = createBrowserHistory();

const App: FC = () => {

    return (
        <Providers>
            <Router history={history}>
                <AuthProvider>
                    <GlobalStyles/>
                    <ScrollReset/>
                    <CookiesNotification/>
                    <SettingsNotification/>
                    {renderRoutes(routes)}
                </AuthProvider>
            </Router>
        </Providers>
    );
};

export default App;
