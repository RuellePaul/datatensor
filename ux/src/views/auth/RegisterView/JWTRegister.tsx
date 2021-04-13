import React, {FC, useState} from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {Box, Button, Checkbox, FormHelperText, Link, makeStyles, TextField, Typography} from '@material-ui/core';
import GoogleCaptcha from 'src/components/utils/GoogleCaptcha';
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

interface JWTRegisterProps {
    className?: string;
}

const useStyles = makeStyles(() => ({
    root: {}
}));

const JWTRegister: FC<JWTRegisterProps> = ({className, ...rest}) => {
    const classes = useStyles();
    const {register} = useAuth() as any;
    const isMountedRef = useIsMountedRef();

    const [reload, setReload] = useState<string>('');

    return (
        <Formik
            initialValues={{
                email: '',
                name: '',
                password: '',
                recaptcha: '',
                policy: false,
                submit: null
            }}
            validationSchema={Yup.object().shape({
                email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                name: Yup.string().max(255).required('Name is required'),
                password: Yup.string().min(7).max(255).required('Password is required'),
                recaptcha: Yup.string().required('Captcha is required'),
                policy: Yup.boolean().oneOf([true], 'This field must be checked')
            })}
            onSubmit={async (values, {
                setErrors,
                setStatus,
                setSubmitting
            }) => {
                try {
                    await register(values.email, values.name, values.password, values.recaptcha);

                    if (isMountedRef.current) {
                        setStatus({success: true});
                        setSubmitting(false);
                    }
                } catch (err) {
                    console.error(err);
                    setStatus({success: false});
                    setErrors({submit: err.message});
                    setSubmitting(false);
                    setReload(Math.random().toString(36).substring(7))
                }
            }}
        >
            {({
                  errors,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  touched,
                  values,
                  setFieldValue
            }) => (
                <form
                    noValidate
                    className={clsx(classes.root, className)}
                    onSubmit={handleSubmit}
                    {...rest}
                >
                    <TextField
                        error={Boolean(touched.name && errors.name)}
                        fullWidth
                        helperText={touched.name && errors.name}
                        label="Name"
                        margin="normal"
                        name="name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.name}
                        variant="outlined"
                    />
                    <TextField
                        error={Boolean(touched.email && errors.email)}
                        fullWidth
                        helperText={touched.email && errors.email}
                        label="Email Address"
                        margin="normal"
                        name="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="email"
                        value={values.email}
                        variant="outlined"
                    />
                    <TextField
                        error={Boolean(touched.password && errors.password)}
                        fullWidth
                        helperText={touched.password && errors.password}
                        label="Password"
                        margin="normal"
                        name="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="password"
                        value={values.password}
                        variant="outlined"
                    />
                    <Box
                        mt={2}
                    >
                        <GoogleCaptcha
                            name='recaptcha'
                            onChange={value => setFieldValue('recaptcha', value)}
                            helperText={touched.recaptcha && errors.recaptcha}
                            key={reload}
                        />
                    </Box>
                    <Box
                        alignItems="center"
                        display="flex"
                        mt={2}
                        ml={-1}
                    >
                        <Checkbox
                            checked={values.policy}
                            name="policy"
                            onChange={handleChange}
                        />
                        <Typography
                            variant="body2"
                            color="textSecondary"
                        >
                            I have read the
                            {' '}
                            <Link
                                component="a"
                                href="#"
                                color="secondary"
                            >
                                Terms and Conditions
                            </Link>
                        </Typography>
                    </Box>
                    {Boolean(touched.policy && errors.policy) && (
                        <FormHelperText error>
                            {errors.policy}
                        </FormHelperText>
                    )}
                    {errors.submit && (
                        <Box mt={3}>
                            <FormHelperText error>
                                {errors.submit}
                            </FormHelperText>
                        </Box>
                    )}
                    <Box mt={2}>
                        <Button
                            color="secondary"
                            disabled={isSubmitting}
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                        >
                            Register
                        </Button>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default JWTRegister;
