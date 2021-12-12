import React, {FC} from 'react';
import {Router} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import GlobalStyles from 'src/components/utils/GlobalStyles';
import ScrollReset from 'src/components/utils/ScrollReset';
import {AuthProvider} from 'src/store/AuthContext';
import routes, {renderRoutes} from 'src/routes';
import Providers from './providers';


const history = createBrowserHistory();

const App: FC = () => {

    return (
        <Providers>
            <Router history={history}>
                <AuthProvider>
                    <GlobalStyles />
                    <ScrollReset />
                    {renderRoutes(routes)}
                </AuthProvider>
            </Router>
        </Providers>
    );
};

export default App;
