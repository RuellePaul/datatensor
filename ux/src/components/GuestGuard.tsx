import React, {FC, ReactNode} from 'react';
import {Redirect} from 'react-router-dom';
import useAuth from '../hooks/useAuth';

interface GuestGuardProps {
    children?: ReactNode;
}

const GuestGuard: FC<GuestGuardProps> = ({children}) => {
    const {isAuthenticated} = useAuth();

    if (isAuthenticated) {
        return <Redirect to="/app/account"/>;
    }

    return (
        <>
            {children}
        </>
    );
};


export default GuestGuard;
