import React, {FC} from 'react';
import {Route as RouterRoute} from 'react-router-dom';
import {Main} from 'layout';

interface RouteProps {
    component: any,
    path: string,
    exact: boolean
}

const Route: FC<RouteProps> = ({component: Component}: RouteProps) => {

    return (
        <RouterRoute
            render={props => <Main>
                <Component {...props}/>
            </Main>}
        />
    )
};

export default Route;
