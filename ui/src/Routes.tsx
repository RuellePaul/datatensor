import React, {FC, lazy, Suspense} from 'react';
import {Redirect, Switch} from 'react-router-dom';

import {Fallback, Route} from 'components';
import {Main} from 'layout';

const Home = lazy(() => import('./views/Home'));
const Login = lazy(() => import('./views/Login'));


const Routes: FC = () => {

    return (
        <Suspense
            fallback={<Fallback>
                <Main/>
            </Fallback>}
        >
            <Switch>
                <Route
                    component={Home}
                    path='/'
                    exact
                />
                <Route
                    component={Login}
                    path='/login'
                    exact
                    title='Login | Datatensor'
                />
                <Redirect to='/'/>
            </Switch>
        </Suspense>
    );
}

export default Routes;
