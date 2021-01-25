import React, {FC, lazy, Suspense} from 'react';
import {Redirect, Switch} from 'react-router-dom';

import {Fallback, Route} from 'components';
import {Main} from 'layout';

const Home = lazy(() => import('./views/Home'));

const Login = lazy(() => import('./views/Auth/Login'));
const Register = lazy(() => import('./views/Auth/Register'));
const ForgotPassword = lazy(() => import('./views/Auth/ForgotPassword'));
const OAuthCallback = lazy(() => import('./views/Auth/OAuthCallback'));
const Logout = lazy(() => import('./views/Auth/Logout'));


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

                {/* ______ Auth ______ */}
                <Route
                    component={Login}
                    path='/login'
                    exact
                    title='Login | Datatensor'
                />
                <Route
                    component={Register}
                    path='/register'
                    exact
                    title='Register | Datatensor'
                />
                <Route
                    component={ForgotPassword}
                    path='/forgot-password'
                    exact
                    title='Reset password | Datatensor'
                />
                <Route
                    component={OAuthCallback}
                    path='/oauthcallback/:scope'
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
