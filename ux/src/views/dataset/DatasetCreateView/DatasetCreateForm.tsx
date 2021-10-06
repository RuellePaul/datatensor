import React, {FC} from 'react';
import {useHistory} from 'react-router-dom';
import clsx from 'clsx';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {useSnackbar} from 'notistack';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    Divider,
    FormControlLabel,
    FormHelperText,
    Grid,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import QuillEditor from 'src/components/QuillEditor';
import api from 'src/utils/api';
import {Dataset} from 'src/types/dataset';


interface ProductCreateFormProps {
    className?: string;
}

const useStyles = makeStyles(() => ({
    root: {},
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
                submit: null,
                is_public: true
            }}
            validationSchema={Yup.object().shape({
                description: Yup.string().max(5000),
                name: Yup.string()
                    .max(255)
                    .required(),
                is_public: Yup.boolean().required()
            })}
            onSubmit={async (values, {setErrors, setStatus, setSubmitting}) => {
                try {
                    const {submit, ...payload} = values;
                    const response = await api.post<Dataset>('/datasets/', payload);
                    const dataset = response.data;
                    console.info(dataset);

                    setStatus({success: true});
                    setSubmitting(false);
                    enqueueSnackbar('Dataset Created', {variant: 'info'});
                    history.push('/app/datasets');
                } catch (err) {
                    console.error(err);
                    setStatus({success: false});
                    setErrors({submit: err.message});
                    setSubmitting(false);
                }
            }}
        >
            {({errors, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue, touched, values}) => (
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
                                        onBlur={handleBlur}
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

                            <Box mt={3}>
                                <Card>
                                    <CardHeader title="Models" />
                                    <Divider />
                                    <CardContent></CardContent>
                                </Card>
                            </Box>

                            <Box mt={3}>
                                <Card>
                                    <CardHeader title="Settings" />
                                    <Divider />
                                    <CardContent>
                                        <Box mt={2}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={values.is_public}
                                                        onChange={handleChange}
                                                        value={values.is_public}
                                                        name="is_public"
                                                    />
                                                }
                                                label="Public dataset"
                                            />
                                            <FormHelperText>A public dataset is visible by anyone.</FormHelperText>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Box>
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
