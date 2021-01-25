import React, {FC} from 'react';
import {useHistory} from 'react-router-dom';

import {api} from 'api';
import {Buttons, Form, Inputs, Structure} from 'components';
import {useUser} from 'hooks';

import {Box, Divider, Link, Typography, useMediaQuery, useTheme} from '@material-ui/core';
import {AccountCircle as EmailIcon, LockOutlined as PasswordIcon} from '@material-ui/icons';

const Login: FC = () => {

    const theme = useTheme();
    const history = useHistory();

    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

    const {setUser} = useUser();

    return (
        <Structure.Center
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
                submit={formState => api.post('/auth/login/', formState!.values)
                    .then(response => setUser(response.data))}
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
                    <Box display='flex' flexDirection='row-reverse'>
                        <Link
                            variant='body1'
                            component='button'
                            onClick={() => history.push('/forgot-password')}
                            type='button'
                        >
                            Forgot password&nbsp;?
                        </Link>
                    </Box>
                    <Buttons.Default
                        label='Sign in now'
                        submit
                    />
                    <Typography align='center' variant='body1' gutterBottom color='textPrimary'>
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
                    Login with
                </Typography>
                <Box
                    display='flex'
                    justifyContent='center'
                    flexDirection={isDesktop ? 'row' : 'column'}
                >
                    <Buttons.LoginOAuth scope='github'/>
                    <Buttons.LoginOAuth scope='google'/>
                    <Buttons.LoginOAuth scope='stackoverflow'/>
                </Box>
            </Box>
        </Structure.Center>
    )
};

export default Login;