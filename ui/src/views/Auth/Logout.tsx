import React, {FC, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {Fallback} from 'components';
import {useUser} from 'hooks';
import Cookies from 'js-cookie';

const Logout: FC = () => {

    const history = useHistory();

    const {setUser} = useUser();

    useEffect(() => {
        setUser({});
        Cookies.remove('access_token');
        history.push('/login');

        // eslint-disable-next-line
    }, []);


    return (
        <Fallback/>
    )
};

export default Logout;