import React, {FC} from 'react';
import {useHistory} from 'react-router-dom';
import PropTypes from 'prop-types';
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
    Divider,
    FormHelperText,
    Grid,
    makeStyles,
    Paper,
    TextField,
    Typography
} from '@material-ui/core';
import QuillEditor from 'src/components/QuillEditor';
import FilesDropzone from 'src/components/FilesDropzone';
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
                files: [],
                name: '',
                submit: null
            }}
            validationSchema={Yup.object().shape({
                description: Yup.string().max(5000),
                files: Yup.array(),
                name: Yup.string().max(255).required()
            })}
            onSubmit={async (values, {
                setErrors,
                setStatus,
                setSubmitting
            }) => {
                try {
                    const {submit, ...payload} = values;
                    const response = await api.post<Dataset>('/v1/dataset/manage/create', payload);
                    const dataset = response.data;
                    console.log(dataset);

                    setStatus({success: true});
                    setSubmitting(false);
                    enqueueSnackbar('Dataset Created', {
                        variant: 'success'
                    });
                    history.push('/app/management/datasets/create');
                } catch (err) {
                    console.error(err);
                    setStatus({success: false});
                    setErrors({submit: err.message});
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
                  setFieldValue,
                  touched,
                  values
              }) => (
                <form
                    onSubmit={handleSubmit}
                    className={clsx(classes.root, className)}
                    {...rest}
                >
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid
                            item
                            xs={12}
                            lg={8}
                        >
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
                                    <Box
                                        mt={3}
                                        mb={1}
                                    >
                                        <Typography
                                            variant="subtitle2"
                                            color="textSecondary"
                                        >
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
                                    {(touched.description && errors.description) && (
                                        <Box mt={2}>
                                            <FormHelperText error>
                                                {errors.description}
                                            </FormHelperText>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                            <Box mt={3}>
                                <Card>
                                    <CardHeader title="Upload Images"/>
                                    <Divider/>
                                    <CardContent>
                                        <FilesDropzone/>
                                    </CardContent>
                                </Card>
                            </Box>
                            <Box mt={3}>
                                <Card>
                                    <CardHeader title="Options"/>
                                    <Divider/>
                                    <CardContent>
                                        ...
                                    </CardContent>
                                </Card>
                            </Box>
                        </Grid>
                    </Grid>
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
                            variant="contained"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            Create dataset
                        </Button>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

DatasetCreateForm.propTypes = {
    className: PropTypes.string
};

export default DatasetCreateForm;
