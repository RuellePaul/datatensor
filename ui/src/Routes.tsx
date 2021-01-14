import React, {FC, lazy, Suspense} from 'react';
import {Redirect, Switch} from 'react-router-dom';
import {Route} from 'components';
import {Main} from 'layout';

const Home = lazy(() => import('./views/Home'));

const FallBack: FC = () => {

    return <>
        Loading...
    </>
};

const Routes: FC = () => {

    return (
        <Suspense
            fallback={<Main>
                <FallBack/>
            </Main>}
        >
            <Switch>
                <Route
                    component={Home}
                    path='/'
                    exact
                />
                <Redirect to='/'/>
            </Switch>
        </Suspense>
    );
}

export default Routes;
