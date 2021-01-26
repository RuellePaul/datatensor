import React, {FC} from 'react';
import {Route as RouterRoute, useHistory} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import {Main} from 'layout';
import {useUser} from 'hooks';
import Cookies from 'js-cookie';

interface RouteProps {
    component: any,
    path: string,
    exact: boolean,
    title?: string,
    authenticated?: boolean
}

const Route: FC<RouteProps> = ({component: Component, title = 'Datatensor', authenticated, ...rest}: RouteProps) => {

    const history = useHistory();

    const {user} = useUser();

    if (authenticated)
        if (!user.id || !Cookies.get('access_token'))
            history.push('/logout');

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
