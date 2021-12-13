import React, {FC} from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {Box, Button, FormHelperText, InputAdornment, TextField} from '@mui/material';
import {AlternateEmail as EmailIcon, LockOutlined as PasswordIcon} from '@mui/icons-material';
import makeStyles from '@mui/styles/makeStyles';
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

interface JWTLoginProps {
    className?: string;
}

const useStyles = makeStyles(() => ({
    root: {}
}));

const JWTLogin: FC<JWTLoginProps> = ({className, ...rest}) => {
    const classes = useStyles();

    const {login} = useAuth();
    const isMountedRef = useIsMountedRef();

    return (
        <Formik
            initialValues={{
                email: process.env.REACT_APP_ENVIRONMENT === 'development' ? 'demo@datatensor.io' : '',
                password: process.env.REACT_APP_ENVIRONMENT === 'development' ? 'Password123' : '',
                submit: null
            }}
            validationSchema={Yup.object().shape({
                email: Yup.string()
                    .email('Must be a valid email')
                    .max(255)
                    .required('Email is required'),
                password: Yup.string()
                    .max(255)
                    .required('Password is required')
            })}
            onSubmit={async (values, {setErrors, setStatus, setSubmitting}) => {
                try {
                    await login(values.email, values.password);

                    if (isMountedRef.current) {
                        setStatus({success: true});
                        setSubmitting(false);
                    }
                } catch (error) {
                    console.error(error);
                    if (isMountedRef.current) {
                        setStatus({success: false});
                        setErrors({submit: error.message});
                        setSubmitting(false);
                    }
                }
            }}
        >
            {({errors, handleChange, handleSubmit, isSubmitting, touched, values}) => (
                <form noValidate onSubmit={handleSubmit} className={clsx(classes.root, className)} {...rest}>
                    <TextField
                        error={Boolean(touched.email && errors.email)}
                        fullWidth
                        helperText={touched.email && errors.email}
                        label="Email"
                        margin="normal"
                        name="email"
                        onChange={handleChange}
                        type="email"
                        value={values.email}
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        error={Boolean(touched.password && errors.password)}
                        fullWidth
                        helperText={touched.password && errors.password}
                        label="Password"
                        margin="normal"
                        name="password"
                        onChange={handleChange}
                        type="password"
                        value={values.password}
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PasswordIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                    {errors.submit && (
                        <Box mt={1}>
                            <FormHelperText error>{errors.submit}</FormHelperText>
                        </Box>
                    )}
                    <Box mt={2}>
                        <Button
                            color="primary"
                            disabled={isSubmitting}
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                        >
                            Log In
                        </Button>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default JWTLogin;
