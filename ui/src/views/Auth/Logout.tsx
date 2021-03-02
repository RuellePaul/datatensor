import React, {FC, useEffect} from 'react';
import {Fallback} from 'components';
import {useUser} from 'hooks';
import Cookies from 'js-cookie';

const Logout: FC = () => {

    const {setUser} = useUser();

    useEffect(() => {
        setUser({});
        Cookies.remove('access_token');
        window.location.replace('/login');

        // eslint-disable-next-line
    }, []);


    return (
        <Fallback/>
    )
};

export default Logout;