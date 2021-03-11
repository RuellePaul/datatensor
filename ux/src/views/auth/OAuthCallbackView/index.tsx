import React, {FC, useEffect} from 'react';
import {useParams} from 'react-router';
import SplashScreen from 'src/components/SplashScreen';
import useAuth from 'src/hooks/useAuth';
import parseQueryArgs from 'src/utils/parseQueryArgs';

const OAuthCallbackView: FC = () => {

    const {loginOAuth} = useAuth();

    const {scope} = useParams();

    useEffect(() => {
        loginOAuth(parseQueryArgs('code'), scope);
    }, [scope, loginOAuth]);

    return (
        <SplashScreen/>
    );
};

export default OAuthCallbackView;
