import React, { FC } from "react";
import clsx from "clsx";
import * as Yup from "yup";
import { Formik } from "formik";
import { useSnackbar } from "notistack";
import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, TextField } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import api from "src/utils/api";

interface SecurityProps {
    className?: string;
}

const useStyles = makeStyles(() => ({
    root: {}
}));

const Security: FC<SecurityProps> = ({className, ...rest}) => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    return (
        <Formik
            initialValues={{
                password: '',
                password_confirm: '',
                new_password: ''
            }}
            validationSchema={Yup.object().shape({
                password: Yup.string()
                    .min(7, 'Must be at least 7 characters')
                    .max(255)
                    .required('Required'),
                new_password: Yup.string()
                    .min(7, 'Must be at least 7 characters')
                    .max(255)
                    .required('Required'),
                password_confirm: Yup.string()
                    .oneOf(
                        [Yup.ref('new_password'), null],
                        'Passwords must match'
                    )
                    .required('Required')
            })}
            onSubmit={async (values, {resetForm, setStatus, setSubmitting}) => {
                try {
                    await api.patch(`/users/me/password`, values);
                    resetForm();
                    setStatus({success: true});
                    setSubmitting(false);
                    enqueueSnackbar('Password updated', {variant: 'success'});
                } catch (error) {
                    enqueueSnackbar(error.message || 'Something went wrong', {
                        variant: 'error'
                    });
                    setStatus({success: false});
                    setSubmitting(false);
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
                values
            }) => (
                <form onSubmit={handleSubmit}>
                    <Card className={clsx(classes.root, className)} {...rest}>
                        <CardHeader title="Change Password" />
                        <Divider />
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item md={4} sm={6} xs={12}>
                                    <TextField
                                        error={Boolean(
                                            touched.password && errors.password
                                        )}
                                        fullWidth
                                        helperText={
                                            touched.password && errors.password
                                        }
                                        label="Password"
                                        name="password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="password"
                                        value={values.password}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item md={4} sm={6} xs={12}>
                                    <TextField
                                        error={Boolean(
                                            touched.new_password &&
                                                errors.new_password
                                        )}
                                        fullWidth
                                        helperText={
                                            touched.new_password &&
                                            errors.new_password
                                        }
                                        label="New Password"
                                        name="new_password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="password"
                                        value={values.new_password}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item md={4} sm={6} xs={12}>
                                    <TextField
                                        error={Boolean(
                                            touched.password_confirm &&
                                                errors.password_confirm
                                        )}
                                        fullWidth
                                        helperText={
                                            touched.password_confirm &&
                                            errors.password_confirm
                                        }
                                        label="Password Confirmation"
                                        name="password_confirm"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="password"
                                        value={values.password_confirm}
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                        <Divider />
                        <Box p={2} display="flex" justifyContent="flex-end">
                            <Button
                                color="primary"
                                disabled={isSubmitting}
                                type="submit"
                                variant="contained"
                            >
                                Change Password
                            </Button>
                        </Box>
                    </Card>
                </form>
            )}
        </Formik>
    );
};

export default Security;
