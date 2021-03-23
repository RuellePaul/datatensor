import React, {FC, ReactNode} from 'react';
import {Redirect} from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

interface GuestGuardProps {
    children?: ReactNode;
}

const GuestGuard: FC<GuestGuardProps> = ({children}) => {
    const {isAuthenticated, user} = useAuth();

    if (isAuthenticated) {
        return <Redirect to={user.is_verified
            ? user.is_admin
                ? "/app/admin/reports/dashboard"
                : "/app/reports/dashboard"
            : "/email-confirmation"}
        />;
    }

    return (
        <>
            {children}
        </>
    );
};


export default GuestGuard;
