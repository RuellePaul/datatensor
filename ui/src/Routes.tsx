import React, {FC, lazy, Suspense} from 'react';
import {Redirect, Switch} from 'react-router-dom';

import {Route} from 'components';
import {Main} from 'layout';

const Home = lazy(() => import('./views/Home'));
const Overview = lazy(() => import('./views/Overview'));
const Settings = lazy(() => import('./views/Settings/Settings'));

const Login = lazy(() => import('./views/Auth/Login'));
const Register = lazy(() => import('./views/Auth/Register'));
const ForgotPassword = lazy(() => import('./views/Auth/ForgotPassword'));
const OAuthCallback = lazy(() => import('./views/Auth/OAuthCallback'));
const Logout = lazy(() => import('./views/Auth/Logout'));

const Datasets = lazy(() => import('./views/Datasets'));


const Routes: FC = () => {

    return (
        <Suspense
            fallback={<Main loading={true}/>}
        >
            <Switch>
                <Route
                    component={Home}
                    path='/'
                    exact
                />
                <Route
                    component={Overview}
                    path='/overview'
                    exact
                    authenticated
                />
                <Route
                    component={Datasets}
                    path='/datasets/:dataset_id'
                    exact
                    authenticated
                />
                <Route
                    component={Settings}
                    path='/settings/:parameter'
                    exact
                    title='Settings | Datatensor'
                    authenticated
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
                <Redirect to='/login'/>
            </Switch>
        </Suspense>
    );
}

export default Routes;
