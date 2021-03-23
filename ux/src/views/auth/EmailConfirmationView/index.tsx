import React, {FC, useEffect} from 'react';
import SplashScreen from 'src/components/screens/SplashScreen';
import parseQueryArgs from 'src/utils/parseQueryArgs';
import useAuth from 'src/hooks/useAuth';

const EmailConfirmationView: FC = () => {

    const {confirmEmail} = useAuth();

    useEffect(() => {
        confirmEmail(parseQueryArgs('activation_code'));
    }, [confirmEmail]);

    return (
        <SplashScreen/>
    );
};

export default EmailConfirmationView;
