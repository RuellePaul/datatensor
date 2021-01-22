import React, {FC} from 'react';

import {Buttons, Form, Inputs, Structure} from 'components';

import {Box, Typography} from '@material-ui/core';
import {AccountCircle as EmailIcon, LockOutlined as PasswordIcon} from '@material-ui/icons';

const Register: FC = () => {

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
                    <Typography
                        align='center'
                        gutterBottom
                        variant='h5'
                    >
                        Create your account
                    </Typography>
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
                </Box>
            </Form>
        </Structure.Paper>
    )
};

export default Register;