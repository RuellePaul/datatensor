import React, {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import routes from 'src/routes';
import SplashScreen from 'src/components/screens/SplashScreen';

const PUBLIC_PATHS = routes.filter(route => route.scope === undefined).map(route => route.path);
const DOCS_PATHS = routes.filter(route => route.scope === 'docs').map(route => route.path);
const APP_PATHS = routes.filter(route => route.scope === 'app').map(route => route.path);

const ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT;

const LocationReset = ({children}) => {
    const location = useLocation();

    useEffect(() => {
        if (ENVIRONMENT === 'production')
            if (PUBLIC_PATHS.includes(location.pathname) && window.location.hostname !== 'datatensor.io')
                window.location.replace(`https://datatensor.io${location.pathname}`);
            else if (DOCS_PATHS.includes(location.pathname) && window.location.hostname !== 'docs.datatensor.io')
                window.location.replace(`https://docs.datatensor.io${location.pathname}`);
            else if (APP_PATHS.includes(location.pathname) && window.location.hostname !== 'app.datatensor.io')
                window.location.replace(`https://app.datatensor.io${location.pathname}`);
    }, [location.pathname]);

    if (ENVIRONMENT === 'production')
        if (PUBLIC_PATHS.includes(location.pathname) && window.location.hostname !== 'datatensor.io')
            return <SplashScreen />;
        else if (DOCS_PATHS.includes(location.pathname) && window.location.hostname !== 'docs.datatensor.io')
            return <SplashScreen />;
        else if (APP_PATHS.includes(location.pathname) && window.location.hostname !== 'app.datatensor.io')
            return <SplashScreen />;

    return children;
};

export default LocationReset;
