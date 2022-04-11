import React, {FC, ReactNode} from 'react';
import {Redirect} from 'react-router-dom';
import useAuth from 'src/hooks/useAuth';

interface AuthGuardProps {
    children?: ReactNode;
}

const AuthGuard: FC<AuthGuardProps> = ({children}) => {
    const {isAuthenticated} = useAuth();

    if (!isAuthenticated) {
        return <Redirect to="/auth/login" />;
    }

    return <>{children}</>;
};

export default AuthGuard;
