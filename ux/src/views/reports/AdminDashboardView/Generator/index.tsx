import React, {FC} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useSnackbar} from 'notistack';

import {Box, Button, Paper, TextField} from '@material-ui/core';
import {Alert} from '@material-ui/lab';

import useIsMountedRef from 'src/hooks/useIsMountedRef';
import api from 'src/utils/api';


const Generator: FC = () => {

    const isMountedRef = useIsMountedRef();
    const {enqueueSnackbar} = useSnackbar();

    return (
        <Paper>
            <Formik
                initialValues={{
                    image_count: 10
                }}
                validationSchema={Yup.object().shape({
                    image_count: Yup.number().max(1000).required(),
                })}
                onSubmit={async (values, {
                    setStatus,
                    setSubmitting
                }) => {
                    try {
                        await api.post('/v1/admin/generator/coco', values);

                        if (isMountedRef.current) {
                            setStatus({success: true});
                            setSubmitting(false);
                            enqueueSnackbar(`Dataset generated (${values.image_count} images)`, {variant: 'info'});
                        }
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
                      touched,
                      values
                  }) => (
                    <form
                        noValidate
                        onSubmit={handleSubmit}
                    >
                        <TextField
                            error={Boolean(touched.image_count && errors.image_count)}
                            fullWidth
                            label="Image count"
                            name="image_count"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            required
                            value={values.image_count}
                            variant="outlined"
                            size="small"
                        />
                        <Box mt={2}>
                            <Button
                                color="secondary"
                                disabled={isSubmitting}
                                fullWidth
                                type="submit"
                                variant="contained"
                            >
                                Generate dataset
                            </Button>
                        </Box>
                        <Box mt={2}>
                            <Alert
                                severity="info"
                            >
                                <div>
                                    Use {' '} <b>carefully</b>.
                                    {' '}
                                    It uses a lot <b>AWS S3 storage</b>
                                </div>
                            </Alert>
                        </Box>

                    </form>
                )}
            </Formik>
        </Paper>
    )
};

export default Generator;