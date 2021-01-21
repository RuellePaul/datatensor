import React, {FC} from 'react';

import {Box, Container, Divider, Paper, Typography} from '@material-ui/core';

import {Buttons, Form} from 'components';

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

                <Box mt='1rem'>
                    <Paper>
                        <Box padding='2rem'>

                            <Form>

                            </Form>

                            <Divider/>

                            <Box
                                mt='1rem'
                            >
                                <Typography
                                    align='center'
                                    color='textSecondary'
                                    gutterBottom
                                >
                                    Login using social media
                                </Typography>
                                <Box
                                    display='flex'
                                    justifyContent='space-evenly'
                                >
                                    <Buttons.LoginOAuth website='github'/>
                                    <Buttons.LoginOAuth website='google'/>
                                    <Buttons.LoginOAuth website='stackoverflow'/>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Box>
    )
};

export default Login;