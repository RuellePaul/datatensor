import React, {FC, useEffect} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {api} from 'api';
import {Fallback} from 'components';
import {useUser} from 'hooks';

interface ParamTypes {
    scope: string
}

const OAuthCallback: FC = () => {

    const history = useHistory();

    const {scope} = useParams<ParamTypes>();

    const {setUser} = useUser();

    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get('code');

        api.post(`auth/login/oauth/callback`, {
            code: code,
            scope
        })
            .then(response => setUser(response.data))
            .catch(() => history.push('/login'))

        // eslint-disable-next-line
    }, [scope]);


    return (
        <Fallback/>
    )
};

export default OAuthCallback;