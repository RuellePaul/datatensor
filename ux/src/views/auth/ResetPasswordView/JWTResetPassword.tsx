import React, {FC} from 'react';
import {useHistory} from 'react-router-dom';
import clsx from 'clsx';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {Box, Button, FormHelperText, InputAdornment, TextField} from '@mui/material';
import {LockOutlined as PasswordIcon} from '@mui/icons-material';
import makeStyles from '@mui/styles/makeStyles';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

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

    return (
        <Formik
            initialValues={{
                password: '',
                submit: null
            }}
            validationSchema={Yup.object().shape({
                password: Yup.string()
                    .min(7, 'Must be at least 7 characters')
                    .max(255)
                    .required('Required')
            })}
            onSubmit={async (values, {setErrors, setStatus, setSubmitting}) => {
                try {
                    // await ...

                    if (isMountedRef.current) {
                        setStatus({success: true});
                        setSubmitting(false);
                        history.push('/login');
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
                            Reset password
                        </Button>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default JWTResetPassword;
