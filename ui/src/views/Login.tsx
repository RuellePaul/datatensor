import React, {FC} from 'react';

import {Buttons} from 'components';

const Login: FC = () => {

    return (
        <>
            <Buttons.LoginOAuth website='github'/>
            <Buttons.LoginOAuth website='google'/>
            <Buttons.LoginOAuth website='stackoverflow'/>
        </>
    )
};

export default Login;