import React, {FC, ReactNode} from 'react';
import {Redirect} from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

interface AuthGuardProps {
    children?: ReactNode;
}

const AuthGuard: FC<AuthGuardProps> = ({children}) => {
    const {isAuthenticated, user} = useAuth();

    if (!isAuthenticated) {
        return <Redirect to="/login"/>;
    }

    if (!user.is_verified)
        return <Redirect to="/email-confirmation"/>;

    return (
        <>
            {children}
        </>
    );
};


export default AuthGuard;
