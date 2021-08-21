import React, {FC} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useSnackbar} from 'notistack';
import {Box, Button, Divider, InputLabel, makeStyles, Paper, TextField, Typography} from '@material-ui/core';
import {Alert} from '@material-ui/lab';

import useIsMountedRef from 'src/hooks/useIsMountedRef';
import {Theme} from 'src/theme';
import api from 'src/utils/api';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(4),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(4, 2)
        }
    },
    button: {
        width: 120,
        maxHeight: 40,
        marginLeft: theme.spacing(1)
    }
}));

const Actions: FC = () => {

    const classes = useStyles();

    const isMountedRef = useIsMountedRef();
    const {enqueueSnackbar} = useSnackbar();


    return (
        <Paper
            className={classes.root}
            elevation={1}
        >
            <Formik
                initialValues={{
                    clicked: false,
                    confirm: null
                }}
                validationSchema={Yup.object().shape({
                    clicked: Yup.boolean().required(),
                    confirm: Yup.string().test({
                        message: 'You must type `Confirm` to proceed',
                        test: value => value === 'Confirm',
                    })
                })}
                onSubmit={async (values, {
                    setStatus,
                    setSubmitting,
                    resetForm
                }) => {
                    try {
                        await api.delete(`/datasets/`);
                        resetForm();

                        if (isMountedRef.current) {
                            setStatus({success: true});
                            setSubmitting(false);
                        }

                        window.location.reload();
                    } catch (error) {
                        console.error(error);
                        if (isMountedRef.current) {
                            setStatus({success: false});
                            setSubmitting(false);
                            enqueueSnackbar(error.message, {variant: 'error'});
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
                    <form
                        noValidate
                        onSubmit={handleSubmit}
                    >
                        <Typography
                            variant='h4'
                            color='textPrimary'
                            gutterBottom
                        >
                            Admin actions
                        </Typography>
                        <Divider/>
                        <Box my={2}>
                            {!values.clicked && (
                                <Button
                                    onClick={() => setFieldValue('clicked', true)}
                                >
                                    Delete your datasets
                                </Button>
                            )}
                            {
                                values.clicked && (
                                    <>
                                        <Typography gutterBottom>
                                            <strong>
                                                Delete all your datasets
                                            </strong>
                                        </Typography>
                                        <Box mb={1}>
                                            <InputLabel>
                                                Type <strong>Confirm</strong> to proceed
                                            </InputLabel>
                                        </Box>
                                        <TextField
                                            autoFocus
                                            error={Boolean(touched.confirm && errors.confirm)}
                                            fullWidth
                                            name='confirm'
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.confirm}
                                            variant='outlined'
                                            size='small'
                                        />
                                        <Box my={1}>
                                            <Button
                                                disabled={isSubmitting || !isValid}
                                                fullWidth
                                                type='submit'
                                                variant='contained'
                                            >
                                                Delete forever
                                            </Button>
                                        </Box>
                                        <Alert
                                            severity='warning'
                                        >
                                            <div>
                                                This will delete all your datasets, and associated data (images, labels,
                                                categories...)
                                                {' '}
                                                <strong>
                                                    forever
                                                </strong>
                                            </div>
                                        </Alert>
                                    </>
                                )
                            }
                        </Box>
                    </form>
                )}
            </Formik>
        </Paper>
    )
};

export default Actions;