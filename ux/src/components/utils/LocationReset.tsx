import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import routes from 'src/routes';

const PUBLIC_PATHS =  routes.filter(route => route.scope === undefined).map(route => route.path);
const DOCS_PATHS =  routes.filter(route => route.scope === 'docs').map(route => route.path);
const APP_PATHS =  routes.filter(route => route.scope === 'app').map(route => route.path);

const LocationReset = () => {
    const location = useLocation();

    useEffect(() => {
        if (PUBLIC_PATHS.includes(location.pathname) && window.location.hostname !== 'datatensor.io')
            window.location.replace(`https://datatensor.io${location.pathname}`);
        else if (DOCS_PATHS.includes(location.pathname) && window.location.hostname !== 'docs.datatensor.io')
            window.location.replace(`https://docs.datatensor.io${location.pathname}`);
        else if (APP_PATHS.includes(location.pathname) && window.location.hostname !== 'app.datatensor.io')
            window.location.replace(`https://app.datatensor.io${location.pathname}`);
    }, [location.pathname])

    return null;
};

export default LocationReset;
