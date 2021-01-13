import React, {FC} from 'react';
import {Route as RouterRoute} from 'react-router-dom';
import {Layout} from 'layout';

interface RouteProps {
    component: any,
    path: string,
    exact: boolean
}

const Route: FC<RouteProps> = ({component: Component}: RouteProps) => {

    return (
        <RouterRoute
            render={props => <Layout>
                <Component {...props}/>
            </Layout>}
        />
    )
};

export default Route;
