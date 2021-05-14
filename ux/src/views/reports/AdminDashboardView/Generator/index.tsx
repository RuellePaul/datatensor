import React, {FC} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useSnackbar} from 'notistack';
import {
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    makeStyles,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from '@material-ui/core';
import {Alert} from '@material-ui/lab';

import useIsMountedRef from 'src/hooks/useIsMountedRef';
import {Theme} from 'src/theme';
import api from 'src/utils/api';
import {Task} from 'src/types/task';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(4),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(4, 2)
        }
    },
}));

const Generator: FC = () => {

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
                    dataset_name: 'coco',
                    image_count: 10
                }}
                validationSchema={Yup.object().shape({
                    image_count: Yup.number().max(100000).required(),
                })}
                onSubmit={async (values, {
                    setStatus,
                    setSubmitting
                }) => {
                    try {
                        const response = await api.post<{ task: Task }>('/tasks/', {type: 'generator', properties: values});
                        console.log(response.data.task)

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
                        <Box mb={3}>
                            <Typography
                                variant='h4'
                                gutterBottom
                            >
                                Generate a dataset
                            </Typography>
                            <Typography
                                color='textSecondary'
                                gutterBottom
                            >
                                This automatically download annotations, and then inject images and labels
                                into a new dataset.
                            </Typography>
                        </Box>
                        <Grid container spacing={2} justify='space-between'>
                            <Grid item lg={12} sm={5} xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel shrink>
                                        Dataset name
                                    </InputLabel>
                                    <Select
                                        error={Boolean(touched.dataset_name && errors.dataset_name)}
                                        label="Dataset name"
                                        name="dataset_name"
                                        fullWidth
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.dataset_name}
                                        variant="standard"
                                    >
                                        <MenuItem value='coco'>COCO 2014</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item lg={12} sm={5} xs={12}>
                                <TextField
                                    error={Boolean(touched.image_count && errors.image_count)}
                                    label="Image count"
                                    fullWidth
                                    name="image_count"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.image_count}
                                    size='small'
                                />
                            </Grid>
                        </Grid>
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