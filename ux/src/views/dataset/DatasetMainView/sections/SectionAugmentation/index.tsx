import React, {FC, useCallback, useEffect, useState} from 'react';
import clsx from 'clsx';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useSnackbar} from 'notistack';
import {Alert, Box, Button, FormHelperText, Grid, Step, StepLabel, Stepper, TextField, Typography} from '@mui/material';
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%'
    }
}));

const steps = ['Select pipeline settings', 'Visualize a sample', 'Augment dataset images'];

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

    const [randomIndex, setRandomIndex] = useState<number | null>(0);

    const pickRandomImage = useCallback(() => {
        if (images && images.length > 1) {
            let random = Math.floor(Math.random() * images.length);

            while (random === randomIndex) {
                random = Math.floor(Math.random() * images.length);
            }

            setRandomIndex(random);
        }
    }, [images, randomIndex]);

    useEffect(() => {
        pickRandomImage();
    }, [pickRandomImage]);

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
                    <Grid container spacing={2} sx={{my: 2}}>
                        <Grid item sm={6} xs={12}>
                            <Typography variant="overline" color="textPrimary" align="center" gutterBottom>
                                Operations pipeline
                            </Typography>

                            <Pipeline readOnly={activeStep > 0} />
                        </Grid>

                        {activeStep === 0 && <Grid item sm={6} xs={12} />}
                        {activeStep === 1 && (
                            <Grid item sm={6} xs={12}>
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
                            <Grid item sm={6} xs={12}>
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
                    </Grid>

                    <Box className={classes.actions}>
                        {activeStep > 0 && (
                            <Button onClick={handleBack} sx={{mr: 2}}>
                                Back
                            </Button>
                        )}

                        {activeStep === 0 && (
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={handleNext}
                                disabled={operations.length === 0}
                            >
                                Visualize a sample
                            </Button>
                        )}
                        {activeStep === 1 && (
                            <Button color="primary" variant="contained" onClick={handleNext}>
                                Continue
                            </Button>
                        )}
                        {activeStep === 2 && (
                            <Button color="primary" variant="contained" type="submit" disabled={isSubmitting}>
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
