import React, {FC} from 'react';
import {useHistory} from 'react-router-dom';

import {Buttons, Form, Inputs, Structure} from 'components';

import {Box, Divider, Link, Typography, useMediaQuery, useTheme} from '@material-ui/core';
import {AccountCircle as EmailIcon, LockOutlined as PasswordIcon} from '@material-ui/icons';

const Login: FC = () => {

    const theme = useTheme();
    const history = useHistory();

    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

    return (
        <Structure.Paper
            title='Sign in to Datatensor'
        >
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
                        adornment={<EmailIcon/>}
                        autoFocus
                    />
                    <Inputs.Text
                        name='password'
                        label='Password'
                        adornment={<PasswordIcon/>}
                        type='password'
                    />
                    <Typography align='right' variant='body1'>
                        <Link
                            variant='body1'
                            component='button'
                            onClick={() => history.push('/forgot-password')}
                        >
                            Forgot password&nbsp;?
                        </Link>
                    </Typography>
                    <Buttons.Default
                        label='Sign in now'
                        submit
                    />
                    <Typography align='center' variant='body1' gutterBottom>
                        New to Datatensor&nbsp;?&nbsp;
                        <Link
                            variant='body1'
                            component='button'
                            onClick={() => history.push('/register')}
                        >
                            Create an account
                        </Link>
                    </Typography>
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
        </Structure.Paper>
    )
};

export default Login;