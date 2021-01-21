import React, {FC} from 'react';

import {Box, Container, Divider, InputAdornment, Paper, Typography, useMediaQuery, useTheme} from '@material-ui/core';
import {AccountCircle as EmailIcon, LockOutlined as PasswordIcon} from '@material-ui/icons';

import {Buttons, Form, Inputs} from 'components';

const Login: FC = () => {

    const theme = useTheme();

    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

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
                        <Box padding='2rem 1rem'>

                            <Form
                                schema={{
                                    email: {
                                        presence: {allowEmpty: false, message: 'Email is required'},
                                        email: {message: 'Email must be valid'}
                                    },
                                    password: {
                                        presence: {allowEmpty: false, message: 'Password is required'},
                                        length: {minimum: 8, message: 'Password is too short'},
                                    }
                                }}
                            >
                                <Box p='1rem'>
                                    <Inputs.Text
                                        name='email'
                                        label='Email'
                                        autoFocus
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position='start'>
                                                    <EmailIcon/>
                                                </InputAdornment>
                                            ),
                                        }}
                                        variant='outlined'
                                    />
                                    <Inputs.Text
                                        name='password'
                                        label='Password'
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position='start'>
                                                    <PasswordIcon/>
                                                </InputAdornment>
                                            ),
                                        }}
                                        type='password'
                                        variant='outlined'
                                    />
                                    <Buttons.Default
                                        label='Sign in now'
                                        submit
                                    />
                                </Box>
                            </Form>

                            <Divider/>

                            <Box
                                mt='1rem'
                            >
                                <Typography
                                    variant='h5'
                                    align='center'
                                    color='textSecondary'
                                    gutterBottom
                                >
                                    Login using OAuth2
                                </Typography>
                                <Box
                                    display='flex'
                                    justifyContent='center'
                                    flexDirection={isDesktop ? 'row' : 'column'}
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