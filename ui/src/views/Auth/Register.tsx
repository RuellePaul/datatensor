import React, {FC} from 'react';
import {useHistory} from 'react-router-dom';
import {Buttons, Form, Inputs, Structure} from 'components';

import {Box, Link, Typography} from '@material-ui/core';
import {AccountCircle as EmailIcon, LockOutlined as PasswordIcon} from '@material-ui/icons';

const Register: FC = () => {

    const history = useHistory();

    return (
        <Structure.Paper
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
                    captcha: {
                        presence: {allowEmpty: false, message: 'Captcha is required'},
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
        </Structure.Paper>
    )
};

export default Register;