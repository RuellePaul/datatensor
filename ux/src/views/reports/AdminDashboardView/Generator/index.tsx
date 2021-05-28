import React, {FC, useCallback, useEffect, useState} from 'react';
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
import useTasks from 'src/hooks/useTasks';
import {Task} from 'src/types/task';
import {DataSource} from 'src/types/datasource';
import {Category} from 'src/types/category';

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

    const {saveTasks} = useTasks();

    const isMountedRef = useIsMountedRef();
    const {enqueueSnackbar} = useSnackbar();

    const [datasources, setDatasources] = useState<DataSource[]>([]);
    const [eligibleCategories, setEligibleCategories] = useState<Category[]>([]);

    const fetchDatasources = useCallback(async () => {
        try {
            const response = await api.get<{ datasources: DataSource[] }>(`/datasources/`);
            setDatasources(response.data.datasources);
        } catch (err) {
            console.error(err);
        }

    }, [setDatasources]);

    const handleDatasourceChange = async (datasource_key) => {
        const response = await api.get<{ categories: Category[] }>(`/datasources/categories`, {params: {datasource_key}});
        setEligibleCategories(response.data.categories)


    };

    useEffect(() => {
        fetchDatasources()
    }, [fetchDatasources]);


    return (
        <Paper
            className={classes.root}
            elevation={1}
        >
            <Formik
                initialValues={{
                    datasource_key: '',
                    image_count: 10
                }}
                validationSchema={Yup.object().shape({
                    datasource_key: Yup.string().required(),
                    image_count: Yup.number().max(40000).required(),
                })}
                onSubmit={async (values, {
                    setStatus,
                    setSubmitting
                }) => {
                    try {
                        const response = await api.post<{ task: Task }>('/tasks/', {
                            type: 'generator',
                            properties: values
                        });
                        saveTasks(tasks => [...tasks, response.data.task]);

                        if (isMountedRef.current) {
                            setStatus({success: true});
                            setSubmitting(false);
                            enqueueSnackbar(`Task added`, {variant: 'info'});
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
                      setFieldValue,
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
                                This automatically download annotations, and then inject images, categories and labels
                                into a new dataset.
                            </Typography>
                        </Box>
                        <Grid container spacing={2} justify='space-between'>
                            <Grid item lg={12} sm={5} xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel shrink>
                                        Datasource
                                    </InputLabel>
                                    <Select
                                        error={Boolean(touched.datasource_key && errors.datasource_key)}
                                        label="Datasource"
                                        name="datasource_key"
                                        fullWidth
                                        onBlur={handleBlur}
                                        onChange={event => {
                                            handleDatasourceChange(event.target.value)
                                            setFieldValue('datasource_key', event.target.value)
                                        }}
                                        value={values.datasource_key}
                                        variant="standard"
                                        displayEmpty
                                    >
                                        <MenuItem value='' disabled>Pickup a datasource</MenuItem>
                                        {datasources.map(datasource => (
                                            <MenuItem value={datasource.value}>{datasource.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <pre>
                                {JSON.stringify(eligibleCategories, null, 4)}
                            </pre>
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