import React, {FC, useCallback, useEffect, useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useSnackbar} from 'notistack';
import {
    Alert,
    Box,
    Button,
    capitalize,
    FormControl,
    InputAdornment,
    InputLabel,
    LinearProgress,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {BurstMode} from '@mui/icons-material';

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
        [theme.breakpoints.down('md')]: {
            padding: theme.spacing(4, 2)
        }
    },
    button: {
        width: 120,
        maxHeight: 40,
        marginLeft: theme.spacing(1)
    }
}));

const Generator: FC = () => {
    const classes = useStyles();

    const {savePaused} = useTasks();

    const isMountedRef = useIsMountedRef();
    const {enqueueSnackbar} = useSnackbar();

    const [datasources, setDatasources] = useState<DataSource[]>([]);

    const [eligibleCategories, setEligibleCategories] = useState<Category[] | null>([]);

    const [maxImageCount, setMaxImageCount] = useState<number>(null);

    const fetchDatasources = useCallback(async () => {
        try {
            const response = await api.get<{datasources: DataSource[]}>(`/datasources/`);
            setDatasources(response.data.datasources);
        } catch (err) {
            console.error(err);
        }
    }, [setDatasources]);

    const handleDatasourceChange = async datasource_key => {
        setEligibleCategories(null);
        const response = await api.get<{categories: Category[]}>(`/datasources/categories`, {params: {datasource_key}});
        setEligibleCategories(response.data.categories);
    };

    const handleSelectedCategoriesChange = async (datasource_key, selected_categories, callback) => {
        setMaxImageCount(null);
        const response = await api.post<{max_image_count: number}>(`/datasources/max-image-count`, {
            datasource_key,
            selected_categories: selected_categories
        });
        setMaxImageCount(response.data.max_image_count);
        callback(response.data.max_image_count);
    };

    useEffect(() => {
        fetchDatasources();
    }, [fetchDatasources]);

    return (
        <Paper className={classes.root} elevation={1}>
            <Formik
                initialValues={{
                    datasource_key: '',
                    selected_categories: [],
                    image_count: null
                }}
                validationSchema={Yup.object().shape({
                    datasource_key: Yup.string().required(),
                    image_count: Yup.number()
                        .max(maxImageCount)
                        .required(),
                    selected_categories: Yup.array().test({
                        message: 'You must select at least one category',
                        test: arr => arr.length > 0
                    })
                })}
                onSubmit={async (values, {setStatus, setSubmitting, resetForm}) => {
                    try {
                        await api.post<{task: Task}>('/tasks/', {
                            type: 'generator',
                            properties: values
                        });
                        savePaused(false);
                        resetForm();
                        setEligibleCategories([]);

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
                            enqueueSnackbar(error.message || 'Something went wrong', {variant: 'error'});
                        }
                    }
                }}
            >
                {({errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, touched, values}) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Box mb={3}>
                            <Typography variant="h4" gutterBottom>
                                Generate a dataset
                            </Typography>
                            <Typography color="textSecondary" gutterBottom>
                                This automatically download annotations, and then inject images, categories and labels
                                into a new dataset.
                            </Typography>
                        </Box>
                        <FormControl fullWidth>
                            <InputLabel shrink>Datasource</InputLabel>
                            <Select
                                label="Datasource"
                                name="datasource_key"
                                value={values.datasource_key}
                                disabled={eligibleCategories === null}
                                displayEmpty
                                error={Boolean(touched.datasource_key && errors.datasource_key)}
                                fullWidth
                                onBlur={handleBlur}
                                onChange={event => {
                                    handleDatasourceChange(event.target.value);
                                    setFieldValue('datasource_key', event.target.value);
                                    setFieldValue('selected_categories', []);
                                }}
                            >
                                <MenuItem value="" disabled>
                                    <em>Pickup a datasource</em>
                                </MenuItem>
                                {datasources.map(datasource => (
                                    <MenuItem key={datasource.key} value={datasource.key}>
                                        {datasource.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {eligibleCategories === null ? (
                            <Box mt={2}>
                                <Typography color="textSecondary" gutterBottom>
                                    Searching available categories...
                                </Typography>
                                <LinearProgress variant="query" />
                            </Box>
                        ) : (
                            eligibleCategories.length > 0 && (
                                <>
                                    <Box mt={2}>
                                        <Typography color="textSecondary">
                                            Selected {values.selected_categories.length} / {eligibleCategories.length}{' '}
                                            categories
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" mt={1} mb={2}>
                                        <FormControl fullWidth>
                                            <Select
                                                error={Boolean(errors.selected_categories)}
                                                multiple
                                                value={values.selected_categories}
                                                onChange={event => {
                                                    setFieldValue(
                                                        'selected_categories',
                                                        event.target.value as string[]
                                                    );
                                                    setFieldValue('image_count', null);
                                                }}
                                                MenuProps={{
                                                    TransitionProps: {
                                                        onExited: () => {
                                                            handleSelectedCategoriesChange(
                                                                values.datasource_key,
                                                                values.selected_categories,
                                                                maxImageCount =>
                                                                    setFieldValue('image_count', maxImageCount)
                                                            );
                                                        }
                                                    }
                                                }}
                                                renderValue={(selected: string[]) =>
                                                    selected.map(value => capitalize(value)).join(', ')
                                                }
                                                variant="filled"
                                                SelectDisplayProps={{
                                                    style: {padding: 10}
                                                }}
                                            >
                                                {eligibleCategories
                                                    .sort((a, b) => -b.name.localeCompare(a.name))
                                                    .map(category => (
                                                        <MenuItem value={category.name} key={category.name}>
                                                            {capitalize(category.name)} ({category.labels_count})
                                                        </MenuItem>
                                                    ))}
                                            </Select>
                                        </FormControl>
                                        <Button
                                            className={classes.button}
                                            onClick={() => {
                                                handleSelectedCategoriesChange(
                                                    values.datasource_key,
                                                    eligibleCategories.map(category => category.name),
                                                    maxImageCount => setFieldValue('image_count', maxImageCount)
                                                );
                                                setFieldValue(
                                                    'selected_categories',
                                                    eligibleCategories.map(category => category.name)
                                                );
                                                setFieldValue('image_count', null);
                                            }}
                                            size="small"
                                        >
                                            Select all
                                        </Button>
                                    </Box>
                                    {values.selected_categories?.length > 0 && (
                                        <>
                                            <TextField
                                                error={Boolean(touched.image_count && errors.image_count)}
                                                label="Image count"
                                                fullWidth
                                                name="image_count"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.image_count}
                                                size="small"
                                                disabled={maxImageCount === null}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <BurstMode />
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                            {maxImageCount === null ? (
                                                <Box mt={1}>
                                                    <Typography color="textSecondary" gutterBottom>
                                                        Searching available images...
                                                    </Typography>
                                                    <LinearProgress variant="query" />
                                                </Box>
                                            ) : (
                                                <Box mt={1}>
                                                    <Typography color="textSecondary" gutterBottom>
                                                        {maxImageCount} images available (
                                                        {eligibleCategories
                                                            .filter(category =>
                                                                values.selected_categories.includes(category.name)
                                                            )
                                                            .map(category => category.labels_count)
                                                            .reduce((acc, val) => acc + val, 0)}{' '}
                                                        labels)
                                                    </Typography>
                                                </Box>
                                            )}
                                        </>
                                    )}
                                </>
                            )
                        )}
                        <Box mt={2}>
                            <Button
                                color="primary"
                                disabled={isSubmitting || values.image_count === null}
                                fullWidth
                                type="submit"
                                variant="contained"
                            >
                                Generate dataset
                            </Button>
                        </Box>
                        <Box mt={2}>
                            <Alert severity="info">
                                <div>
                                    Use <b>carefully</b>. It uses a lot <b>AWS S3 storage</b>
                                </div>
                            </Alert>
                        </Box>
                    </form>
                )}
            </Formik>
        </Paper>
    );
};

export default Generator;
