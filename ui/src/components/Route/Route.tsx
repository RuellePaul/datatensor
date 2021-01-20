import React, {FC} from 'react';
import {Route as RouterRoute} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import {Main} from 'layout';

interface RouteProps {
    component: any,
    path: string,
    exact: boolean,
    title?: string
}

const Route: FC<RouteProps> = ({component: Component, title = 'Datatensor', ...rest}: RouteProps) => {

    return (
        <>
            <RouterRoute
                {...rest}
                render={props => <Main>
                    <Component {...props}/>
                </Main>}
            />

            <Helmet title={title}/>
        </>
    )
};

export default Route;
