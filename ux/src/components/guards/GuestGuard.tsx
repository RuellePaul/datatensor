import React, {FC, ReactNode} from 'react';
import {Redirect} from 'react-router-dom';
import useAuth from 'src/hooks/useAuth';

interface GuestGuardProps {
    children?: ReactNode;
}

const GuestGuard: FC<GuestGuardProps> = ({children}) => {
    const {isAuthenticated, user} = useAuth();

    if (isAuthenticated) {
        return <Redirect to={user.is_admin
            ? "/app/admin/dashboard"
            : "/app/dashboard"}
        />;
    }

    return (
        <>
            {children}
        </>
    );
};


export default GuestGuard;
