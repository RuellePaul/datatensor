import React, {FC} from 'react';
import clsx from 'clsx';
import {Formik} from 'formik';
import {useSnackbar} from 'notistack';
import * as Yup from 'yup';
import {Alert, AlertTitle, Box, Button, CircularProgress, InputLabel, TextField, Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {DeleteOutline as DeleteIcon} from '@mui/icons-material';
import {Theme} from 'src/theme';
import api from 'src/utils/api';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

interface UnregisterProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    deleteAction: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.error.main,
        '&:hover': {
            backgroundColor: theme.palette.error.dark
        }
    },
    loader: {
        width: '20px !important',
        height: '20px !important'
    }
}));

const Unregister: FC<UnregisterProps> = ({className, ...rest}) => {
    const classes = useStyles();

    const isMountedRef = useIsMountedRef();
    const {enqueueSnackbar} = useSnackbar();

    return (
        <div className={clsx(classes.root, className)} {...rest}>
            <Box mb={2}>
                <Alert severity="error">
                    <AlertTitle>Delete account</AlertTitle>
                    Be careful, once deleted, there is no going back.{' '}
                    <strong>Your account will be lost forever</strong>
                </Alert>
            </Box>

            <Formik
                initialValues={{
                    clicked: false,
                    confirm: null
                }}
                validationSchema={Yup.object().shape({
                    clicked: Yup.boolean().required(),
                    confirm: Yup.string().test({
                        message: 'You must type `delete definitely` to proceed',
                        test: value => value === 'delete definitely'
                    })
                })}
                onSubmit={async (values, {setStatus, setSubmitting}) => {
                    try {
                        await api.post('/auth/unregister');
                        window.location.href = '/';

                        if (isMountedRef.current) {
                            setStatus({success: true});
                            setSubmitting(false);
                        }
                    } catch (error) {
                        console.error(error);

                        if (isMountedRef.current) {
                            setStatus({success: false});
                            setSubmitting(false);
                            enqueueSnackbar(
                                error.message || 'Something went wrong',
                                {variant: 'error'}
                            );
                        }
                    }
                }}
            >
                {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue,
                    touched,
                    values,
                    isValid
                }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Box my={2}>
                            {!values.clicked && (
                                <Button
                                    className={classes.deleteAction}
                                    onClick={() =>
                                        setFieldValue('clicked', true)
                                    }
                                    startIcon={<DeleteIcon />}
                                    variant="contained"
                                >
                                    Delete account
                                </Button>
                            )}
                            {values.clicked && (
                                <>
                                    <Typography
                                        color="textPrimary"
                                        gutterBottom
                                    >
                                        <strong>Unregister your account</strong>
                                    </Typography>
                                    <Box mb={1}>
                                        <InputLabel>
                                            Type{' '}
                                            <strong>delete definitely</strong>{' '}
                                            to proceed
                                        </InputLabel>
                                    </Box>
                                    <TextField
                                        autoFocus
                                        error={Boolean(
                                            touched.confirm && errors.confirm
                                        )}
                                        name="confirm"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.confirm}
                                        variant="outlined"
                                        size="small"
                                    />
                                    <Box my={1}>
                                        <Button
                                            className={classes.deleteAction}
                                            disabled={isSubmitting || !isValid}
                                            startIcon={<DeleteIcon />}
                                            endIcon={
                                                isSubmitting && (
                                                    <CircularProgress
                                                        className={
                                                            classes.loader
                                                        }
                                                        color="inherit"
                                                    />
                                                )
                                            }
                                            type="submit"
                                            variant="contained"
                                        >
                                            Unregister
                                        </Button>
                                    </Box>
                                </>
                            )}
                        </Box>
                    </form>
                )}
            </Formik>
        </div>
    );
};

export default Unregister;
