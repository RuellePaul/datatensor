import React, {FC, useState} from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {Box, Button, Divider, FormHelperText, InputAdornment, Link, TextField, Typography} from '@mui/material';
import {AlternateEmail as EmailIcon} from '@mui/icons-material';
import makeStyles from '@mui/styles/makeStyles';
import GoogleCaptcha from 'src/components/utils/GoogleCaptcha';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import useAuth from 'src/hooks/useAuth';

interface JWTForgotPasswordProps {
    className?: string;
}

const useStyles = makeStyles(() => ({
    root: {}
}));

const JWTForgotPassword: FC<JWTForgotPasswordProps> = ({className, ...rest}) => {
    const classes = useStyles();

    const isMountedRef = useIsMountedRef();

    const {sendPasswordRecoveryLink} = useAuth();

    const [reload, setReload] = useState<string>('');

    const [send, setSend] = useState<boolean>(false);

    if (send)
        return (
            <>
                <Divider/>
                <Typography gutterBottom>We have just sent you a password recovery email.</Typography>
                <Typography gutterBottom>
                    If you did not receive it, check your spam or{' '}
                    <Link
                        color='primary'
                        onClick={() => setSend(false)}
                    >
                        make a request again
                    </Link>
                    .
                </Typography>
            </>
        );

    return (
        <Formik
            initialValues={{
                email: '',
                recaptcha: '',
                submit: null
            }}
            validationSchema={Yup.object().shape({
                email: Yup.string()
                    .email('Must be a valid email')
                    .max(255)
                    .required('Email is required'),
                recaptcha: Yup.string().required('Captcha is required')
            })}
            onSubmit={async (values, {setErrors, setStatus, setSubmitting}) => {
                try {
                    await sendPasswordRecoveryLink(values.email, values.recaptcha);

                    if (isMountedRef.current) {
                        setStatus({success: true});
                        setSubmitting(false);
                        setSend(true);
                    }
                } catch (error) {
                    console.error(error);
                    if (isMountedRef.current) {
                        setStatus({success: false});
                        setErrors({submit: error.message});
                        setSubmitting(false);
                        setReload(
                            Math.random()
                                .toString(36)
                                .substring(7)
                        );
                    }
                }
            }}
        >
            {({errors, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue}) => (
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
                    <Box mt={2}>
                        <GoogleCaptcha
                            name="recaptcha"
                            onChange={value => setFieldValue('recaptcha', value)}
                            helperText={touched.recaptcha && errors.recaptcha}
                            key={reload}
                        />
                    </Box>
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
                            Send recovery link
                        </Button>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default JWTForgotPassword;
