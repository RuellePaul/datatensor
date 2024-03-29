import React, {FC, ReactNode} from 'react';
import {Redirect} from 'react-router-dom';
import useAuth from 'src/hooks/useAuth';


interface GuestGuardProps {
    children?: ReactNode;
}

const GuestGuard: FC<GuestGuardProps> = ({children}) => {
    const {isAuthenticated} = useAuth();

    if (isAuthenticated) {
        return <Redirect to='/app/datasets' />;
    }

    return <>{children}</>;
};

export default GuestGuard;
