import React, {FC, useState} from 'react';
import clsx from 'clsx';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useSnackbar} from 'notistack';
import {Alert, Box, Button, capitalize, Chip, FormHelperText, Grid, Link, TextField, Typography} from '@mui/material';
import {KeyboardArrowLeft as BackIcon, KeyboardArrowRight as NextIcon} from '@mui/icons-material';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';
import Pipeline from 'src/components/core/Pipeline';
import PipelineSample from 'src/components/core/PipelineSample';
import useImages from 'src/hooks/useImages';
import {SectionProps} from '../SectionProps';
import api from 'src/utils/api';
import {Task} from 'src/types/task';
import useTasks from 'src/hooks/useTasks';
import useDataset from 'src/hooks/useDataset';
import {useSelector} from 'src/store';
import {Operation, OperationType} from 'src/types/pipeline';
import {Label} from 'src/types/label';
import {OPERATIONS_ICONS, OPERATIONS_TYPES} from 'src/config';

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    wrapper: {
        border: `solid 1px ${theme.palette.divider}`,
        borderRadius: theme.spacing(0.5)
    },
    refresh: {
        width: '100%',
        margin: theme.spacing(1, 'auto')
    },
    dialog: {
        padding: theme.spacing(1, 2, 2)
    },
    close: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    },
    actions: {
        marginTop: theme.spacing(2),
        paddingTop: theme.spacing(2),
        borderTop: `dashed 1px #7f8e9d`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%'
    }
}));

const SectionAugmentation: FC<SectionProps> = ({className}) => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    const {dataset} = useDataset();
    const {images} = useImages();
    const {saveTasks} = useTasks();

    const pipeline = useSelector(state => state.pipeline);
    const operations: Operation[] = pipeline.operations.allTypes.map(type => pipeline.operations.byType[type]);

    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const [operationType, setOperationType] = useState<OperationType>(OPERATIONS_TYPES[0]);

    if (images === null || images.length === 0) return null;

    return (
        <Formik
            initialValues={{
                image_count: dataset.image_count * 2,
                submit: null
            }}
            validationSchema={Yup.object().shape({
                image_count: Yup.number()
                    .min(dataset.image_count)
                    .max(dataset.image_count * 4)
            })}
            onSubmit={async (values, {setErrors, setStatus, setSubmitting}) => {
                try {
                    const response = await api.post<{
                        task: Task;
                    }>(`/datasets/${dataset.id}/tasks/`, {
                        type: 'augmentor',
                        properties: {
                            operations,
                            image_count: values.image_count
                        }
                    });
                    saveTasks(tasks => [...(tasks || []), response.data.task]);

                    setStatus({success: true});
                    setSubmitting(false);
                    enqueueSnackbar('Augmentation task created', {variant: 'info'});
                } catch (err) {
                    console.error(err);
                    setStatus({success: false});
                    setErrors({submit: err.message});
                    setSubmitting(false);
                }
            }}
        >
            {({errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values}) => (
                <form onSubmit={handleSubmit} className={clsx(classes.root, className)}>
                    <Grid container columnSpacing={4} rowSpacing={1}>
                        {activeStep === 0 && (
                            <Grid item sm={7} xs={12}>
                                <Typography variant="overline" color="textPrimary" align="center" gutterBottom>
                                    Introduction
                                </Typography>

                                <Typography variant="body1" gutterBottom>
                                    The image augmentation process allows you to <strong>generate new images</strong> in
                                    order to get a richer dataset, without having to re-label anything.
                                </Typography>

                                <Typography variant="body2" gutterBottom color='textSecondary'>
                                    To get augmented images of each original labeled image in your dataset, you need to
                                    set up a pipeline of operations to apply.{' '}
                                    <Link
                                        variant="caption"
                                        color="primary"
                                        onClick={() => window.open('/docs/datasets/augmentation', '_blank')}
                                    >
                                        Learn more
                                    </Link>
                                </Typography>

                                <Box display="flex" flexWrap="wrap" mt={1.5} mb={1}>
                                    {OPERATIONS_TYPES.slice(0, 7).map(operation_type => (
                                        <Chip
                                            key={operation_type}
                                            label={capitalize(operation_type).replaceAll('_', ' ')}
                                            icon={OPERATIONS_ICONS[operation_type]}
                                            clickable
                                            onClick={() => setOperationType(operation_type)}
                                            sx={{mb: 0.5, mr: 0.5}}
                                            variant={operation_type === operationType ? 'filled' : 'outlined'}
                                        />
                                    ))}
                                </Box>

                                <Box my={1} height={200} sx={{aspectRatio: '1 / 1'}}>
                                    <img
                                        src={`/static/images/augmentation/operations/${operationType}.gif`}
                                        alt={`${operationType}.gif`}
                                        width="100%"
                                    />
                                </Box>

                                <Typography variant="caption">
                                    Every operation has at minimum a probability parameter, which controls how likely
                                    the operation will be applied to each image that is seen as the image passes through
                                    the pipeline.
                                </Typography>
                            </Grid>
                        )}

                        {activeStep === 1 && (
                            <Grid item sm={7} xs={12}>
                                <Typography variant="overline" color="textPrimary" align="center" gutterBottom>
                                    Sample
                                </Typography>

                                <Typography variant="body2" gutterBottom>
                                    A sample is the result of your operations pipeline applied to one image of your
                                    dataset.
                                </Typography>

                                <PipelineSample
                                    handler={operations =>
                                        api.post<{images: string[]; images_labels: Label[][]}>(
                                            `/datasets/${dataset.id}/pipelines/sample`,
                                            {operations}
                                        )
                                    }
                                />
                            </Grid>
                        )}

                        {activeStep === 2 && (
                            <Grid item sm={7} xs={12}>
                                <Typography variant="overline" color="textPrimary" align="center" gutterBottom>
                                    Properties
                                </Typography>

                                <Box my={1}>
                                    <TextField
                                        error={Boolean(touched.image_count && errors.image_count)}
                                        helperText={touched.image_count && errors.image_count}
                                        fullWidth
                                        label="Image count"
                                        name="image_count"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="number"
                                        value={values.image_count}
                                        variant="outlined"
                                    />
                                </Box>

                                <Box mt={2} mb={3}>
                                    <Alert severity="info">
                                        There are <strong>{dataset.image_count} original images</strong> in your
                                        dataset, so you can generate up to{' '}
                                        <strong>{dataset.image_count * 4} new images</strong>.
                                    </Alert>
                                </Box>

                                {errors.submit && (
                                    <Box mt={3}>
                                        <FormHelperText error>{errors.submit}</FormHelperText>
                                    </Box>
                                )}
                            </Grid>
                        )}

                        <Grid item sm={5} xs={12}>
                            <Typography variant="overline" color="textPrimary" align="center" gutterBottom>
                                Operations pipeline
                            </Typography>

                            <Pipeline />
                        </Grid>
                    </Grid>

                    <Box className={classes.actions}>
                        {activeStep > 0 && (
                            <Button startIcon={<BackIcon />} onClick={handleBack} sx={{mr: 2}}>
                                Back
                            </Button>
                        )}

                        {activeStep === 0 && (
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={handleNext}
                                disabled={operations.length === 0}
                                endIcon={<NextIcon />}
                            >
                                Visualize a sample
                            </Button>
                        )}
                        {activeStep === 1 && (
                            <Button color="primary" variant="contained" onClick={handleNext} endIcon={<NextIcon />}>
                                Continue
                            </Button>
                        )}
                        {activeStep === 2 && (
                            <Button
                                color="primary"
                                variant="contained"
                                type="submit"
                                disabled={isSubmitting}
                                endIcon={<NextIcon />}
                            >
                                Create task
                            </Button>
                        )}
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default SectionAugmentation;
