import React, {FC, lazy, Suspense} from 'react';
import {Redirect, Switch} from 'react-router-dom';

import {Fallback, Route} from 'components';
import {Main} from 'layout';

const Home = lazy(() => import('./views/Home'));

const Login = lazy(() => import('./views/Login'));
const OAuthCallback = lazy(() => import('./views/OAuthCallback'));
const Logout = lazy(() => import('./views/Logout'));


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
                <Route
                    component={OAuthCallback}
                    path='/oauthcallback/:website'
                    exact
                    title='Please wait...'
                />
                <Route
                    component={Logout}
                    path='/logout'
                    exact
                    title='Please wait...'
                />
                <Redirect to='/'/>
            </Switch>
        </Suspense>
    );
}

export default Routes;
