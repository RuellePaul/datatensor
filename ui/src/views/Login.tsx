import React, {FC} from 'react';

import {Box, Container, Typography} from '@material-ui/core';

import {Buttons} from 'components';

const Login: FC = () => {

    return (
        <Box p='5rem 0'>
            <Container
                maxWidth='sm'
            >
                <Typography
                    variant='h3'
                    align='center'
                    color='textPrimary'
                >
                    Sign in to Datatensor
                </Typography>

                <Box
                    display='flex'
                    justifyContent='space-evenly'
                >
                    <Buttons.LoginOAuth website='github'/>
                    <Buttons.LoginOAuth website='google'/>
                    <Buttons.LoginOAuth website='stackoverflow'/>
                </Box>
            </Container>
        </Box>
    )
};

export default Login;