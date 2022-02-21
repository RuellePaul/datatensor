import React, {FC} from 'react';
import {useHistory} from 'react-router-dom';
import clsx from 'clsx';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {useSnackbar} from 'notistack';
import {Box, Button, Card, CardContent, FormHelperText, Grid, Paper, TextField, Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';
import QuillEditor from 'src/components/QuillEditor';
import api from 'src/utils/api';
import {Dataset} from 'src/types/dataset';

interface ProductCreateFormProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        margin: theme.spacing(2, 0)
    },
    editor: {
        '& .ql-editor': {
            height: 400
        }
    }
}));

const DatasetCreateForm: FC<ProductCreateFormProps> = ({className, ...rest}) => {
    const classes = useStyles();
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();

    return (
        <Formik
            initialValues={{
                description: '',
                name: '',
                submit: null
            }}
            validationSchema={Yup.object().shape({
                description: Yup.string().max(5000),
                name: Yup.string()
                    .max(255)
                    .required("Dataset name is required.")
            })}
            onSubmit={async (values, {setErrors, setStatus, setSubmitting}) => {
                try {
                    const {submit, ...payload} = values;
                    const response = await api.post<{dataset: Dataset}>('/datasets/', payload);
                    const dataset = response.data.dataset;
                    setStatus({success: true});
                    setSubmitting(false);
                    enqueueSnackbar(`Dataset ${dataset.name} created`);
                    history.push(`/datasets/${dataset.id}`);
                } catch (err) {
                    console.error(err);
                    setStatus({success: false});
                    setErrors({submit: err.message});
                    setSubmitting(false);
                }
            }}
        >
            {({errors, handleChange, handleSubmit, isSubmitting, setFieldValue, touched, values}) => (
                <form onSubmit={handleSubmit} className={clsx(classes.root, className)} {...rest}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} lg={8}>
                            <Card>
                                <CardContent>
                                    <TextField
                                        error={Boolean(touched.name && errors.name)}
                                        fullWidth
                                        helperText={touched.name && errors.name}
                                        label="Dataset Name"
                                        name="name"
                                        onChange={handleChange}
                                        value={values.name}
                                        variant="outlined"
                                    />
                                    <Box mt={3} mb={1}>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            Description
                                        </Typography>
                                    </Box>
                                    <Paper variant="outlined">
                                        <QuillEditor
                                            className={classes.editor}
                                            value={values.description}
                                            onChange={(value: string) => setFieldValue('description', value)}
                                        />
                                    </Paper>
                                    {touched.description && errors.description && (
                                        <Box mt={2}>
                                            <FormHelperText error>{errors.description}</FormHelperText>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {errors.submit && (
                        <Box mt={3}>
                            <FormHelperText error>{errors.submit}</FormHelperText>
                        </Box>
                    )}

                    <Box mt={2}>
                        <Button color="primary" variant="contained" type="submit" disabled={isSubmitting}>
                            Create dataset
                        </Button>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default DatasetCreateForm;
