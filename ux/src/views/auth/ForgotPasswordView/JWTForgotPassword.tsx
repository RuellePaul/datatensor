import React, {FC} from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {Box, Button, FormHelperText, InputAdornment, TextField} from '@mui/material';
import {AlternateEmail as EmailIcon} from '@mui/icons-material';
import makeStyles from '@mui/styles/makeStyles';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

interface JWTForgotPasswordProps {
    className?: string;
}

const useStyles = makeStyles(() => ({
    root: {}
}));

const JWTForgotPassword: FC<JWTForgotPasswordProps> = ({className, ...rest}) => {
    const classes = useStyles();

    const isMountedRef = useIsMountedRef();

    return (
        <Formik
            initialValues={{
                email: '',
                submit: null
            }}
            validationSchema={Yup.object().shape({
                email: Yup.string()
                    .email('Must be a valid email')
                    .max(255)
                    .required('Email is required')
            })}
            onSubmit={async (values, {setErrors, setStatus, setSubmitting}) => {
                try {
                    // await ...

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
