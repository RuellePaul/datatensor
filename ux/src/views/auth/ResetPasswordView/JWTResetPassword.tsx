import React, {FC} from 'react';
import {useHistory} from 'react-router-dom';
import clsx from 'clsx';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {Box, Button, FormHelperText, InputAdornment, TextField} from '@mui/material';
import {LockOutlined as PasswordIcon} from '@mui/icons-material';
import makeStyles from '@mui/styles/makeStyles';
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import parseQueryArgs from 'src/utils/parseQueryArgs';

interface JWTResetPasswordProps {
    className?: string;
}

const useStyles = makeStyles(() => ({
    root: {}
}));

const JWTResetPassword: FC<JWTResetPasswordProps> = ({className, ...rest}) => {
    const classes = useStyles();
    const history = useHistory();

    const isMountedRef = useIsMountedRef();

    const {resetPassword} = useAuth();

    const recovery_code = parseQueryArgs('recovery_code');

    return (
        <Formik
            initialValues={{
                new_password: '',
                password_confirmation: '',
                submit: null
            }}
            validationSchema={Yup.object().shape({
                new_password: Yup.string()
                    .min(7, 'Must be at least 7 characters')
                    .max(255)
                    .required('Required'),
                password_confirmation: Yup.string()
                    .oneOf([Yup.ref('new_password'), null], 'Passwords do not match')
                    .required('Champ requis')
            })}
            onSubmit={async (values, {setErrors, setStatus, setSubmitting}) => {
                try {
                    await resetPassword(values.new_password, recovery_code);

                    if (isMountedRef.current) {
                        setStatus({success: true});
                        setSubmitting(false);
                        history.push('/auth/login');
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
                        error={Boolean(touched.new_password && errors.new_password)}
                        fullWidth
                        helperText={touched.new_password && errors.new_password}
                        label="New password"
                        margin="normal"
                        name="new_password"
                        onChange={handleChange}
                        type="password"
                        value={values.new_password}
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PasswordIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        error={Boolean(touched.password_confirmation && errors.password_confirmation)}
                        fullWidth
                        helperText={touched.password_confirmation && errors.password_confirmation}
                        label="Confirm new password"
                        margin="normal"
                        name="password_confirmation"
                        onChange={handleChange}
                        type="password"
                        value={values.password_confirmation}
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
                            Reset password
                        </Button>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default JWTResetPassword;
