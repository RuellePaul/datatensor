import React, {FC, ReactNode} from 'react';
import {Redirect} from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

interface AuthGuardProps {
    children?: ReactNode;
}

const AuthGuard: FC<AuthGuardProps> = ({children}) => {
    const {isAuthenticated} = useAuth();

    if (!isAuthenticated) {
        return <Redirect to="/login"/>;
    }

    return (
        <>
            {children}
        </>
    );
};


export default AuthGuard;
