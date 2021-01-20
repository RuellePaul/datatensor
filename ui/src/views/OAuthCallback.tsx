import React, {FC, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {api} from 'api';
import {Fallback} from 'components';
import {useUser} from 'hooks';

interface ParamTypes {
    website: string
}

const OAuthCallback: FC = () => {

    const {website} = useParams<ParamTypes>();

    const {setUser} = useUser();

    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get('code');

        api.post(`/login/oauth/callback/${website}`, {code: code})
            .then(response => {
                setUser(response.data);
            })

        // eslint-disable-next-line
    }, []);


    return (
        <Fallback/>
    )
};

export default OAuthCallback;