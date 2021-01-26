import React, {FC} from 'react';
import {useHistory} from 'react-router-dom';

import {api} from 'api';
import {Buttons, Form, Inputs, Structure} from 'components';
import {useUser} from 'hooks';

import {Box, Link, Typography} from '@material-ui/core';
import {AccountCircle as EmailIcon, LockOutlined as PasswordIcon} from '@material-ui/icons';

const Register: FC = () => {

    const history = useHistory();

    const {setUser} = useUser();

    return (
        <Structure.Center
            title='Join Datatensor'
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
                    },
                    name: {
                        presence: {allowEmpty: false, message: 'Username is required'},
                    },
                    captcha: {
                        presence: {allowEmpty: false, message: 'Captcha is required'},
                    }
                }}
                submit={formState => api.post('/auth/register/', formState!.values)
                    .then(response => {
                        setUser(response.data);
                        history.push('/overview');
                    })
                }
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
                    <Inputs.Text
                        name='name'
                        label='Username'
                    />
                    <Inputs.Captcha
                        name='captcha'
                    />
                    <Buttons.Default
                        label='Sign up now'
                        submit
                    />
                    <Typography align='center' variant='body1' gutterBottom color='textPrimary'>
                        Already signed up&nbsp;?&nbsp;
                        <Link
                            variant='body1'
                            component='button'
                            onClick={() => history.push('/login')}
                        >
                            Sign in !
                        </Link>
                    </Typography>

                </Box>
            </Form>
        </Structure.Center>
    )
};

export default Register;