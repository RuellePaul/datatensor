import React, {FC} from 'react';
import clsx from 'clsx';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useSnackbar} from 'notistack';
import {
    Alert,
    Box,
    Button,
    FormHelperText,
    Grid,
    Link,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography
} from '@mui/material';
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
import {Operation} from 'src/types/pipeline';
import {Label} from 'src/types/label';
import {Link as RouterLink} from 'react-router-dom';

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
        paddingTop: theme.spacing(2),
        borderTop: `solid 1px #7f8e9d`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%'
    }
}));

const steps = ['Set operations pipeline', 'Visualize a sample', 'Augment dataset'];

const SectionAugmentation: FC<SectionProps> = ({className}) => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    const {dataset} = useDataset();
    const {images} = useImages();
    const {saveTasks} = useTasks();

    const pipeline = useSelector(state => state.pipeline);
    const operations: Operation[] = pipeline.operations.allTypes.map(type => pipeline.operations.byType[type]);

    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

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
                    saveTasks(tasks => [...tasks, response.data.task]);

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
                    <Stepper activeStep={activeStep}>
                        {steps.map(label => {
                            const stepProps: {completed?: boolean} = {};
                            const labelProps: {
                                optional?: React.ReactNode;
                            } = {};
                            return (
                                <Step key={label} {...stepProps}>
                                    <StepLabel {...labelProps}>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    <Grid container columnSpacing={3} rowSpacing={1} sx={{my: 2}}>
                        {activeStep === 0 && (
                            <>
                                <Grid item sm={7} xs={12}>
                                    <Typography variant="body2" gutterBottom>
                                        First, configure your operations pipeline to fit your need. It will apply on all
                                        images of your dataset.
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        Every operation has at minimum a probability parameter, which controls how
                                        likely the operation will be applied to each image that is seen as the image
                                        passes through the pipeline.{' '}
                                        <Link
                                            variant="body2"
                                            color="primary"
                                            component={RouterLink}
                                            to="/datasets/augmentation"
                                        >
                                            Learn more
                                        </Link>
                                    </Typography>
                                </Grid>
                            </>
                        )}

                        {activeStep === 1 && (
                            <Grid item sm={7} xs={12}>
                                <Typography variant="body2" gutterBottom>
                                    A sample is the result of your operations pipeline applied to the first image of
                                    your dataset.
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
