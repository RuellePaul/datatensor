import React, {FC, useState} from 'react';
import clsx from 'clsx';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useSnackbar} from 'notistack';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormHelperText,
    Grid,
    IconButton,
    TextField,
    Typography
} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {Close as CloseIcon} from '@mui/icons-material';
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
    }
}));

const SectionAugmentation: FC<SectionProps> = ({className}) => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    const {dataset} = useDataset();
    const {images} = useImages();
    const {saveTasks} = useTasks();

    const [openAugmentation, setOpenAugmentation] = useState<boolean>(false);

    const handleOpen = () => {
        setOpenAugmentation(true);
    };

    const handleClose = () => {
        setOpenAugmentation(false);
    };

    const pipeline = useSelector<any>(state => state.pipeline);
    const operations: Operation[] = pipeline.operations.allIds.map(id => pipeline.operations.byId[id]);

    if (images === null || images.length === 0) return null;

    return (
        <div className={clsx(classes.root, className)}>
            <Box my={2}>
                <Typography color="textSecondary" gutterBottom>
                    Choose operations pipeline that fit the best for your dataset.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item md={3} sm={6} xs={12}>
                    <Typography variant="overline" color="textPrimary" align="center" gutterBottom>
                        Operations pipeline
                    </Typography>

                    <Pipeline />
                </Grid>
                <Grid item md={9} xs={12}>
                    <Typography variant="overline" color="textPrimary" align="center" gutterBottom>
                        Sample
                    </Typography>

                    <PipelineSample
                        handler={operations =>
                            api.post<{images: string[]; images_labels: Label[][]}>(
                                `/datasets/${dataset.id}/pipelines/sample`,
                                {
                                    operations
                                }
                            )
                        }
                    />
                </Grid>
            </Grid>

            <Button variant="contained" color="primary" onClick={handleOpen}>
                Augment images
            </Button>

            <Dialog
                closeAfterTransition
                disableRestoreFocus
                PaperProps={{
                    className: classes.dialog
                }}
                fullWidth
                maxWidth="sm"
                open={openAugmentation}
                onClose={handleClose}
            >
                <DialogTitle>
                    <Typography>Augmentation</Typography>

                    <IconButton className={classes.close} onClick={handleClose} size="large">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent className="scroll">
                    <Grid container spacing={2}>
                        <Grid item sm={6} xs={12}>
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
                                        handleClose();
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

                                        <Box mt={2}>
                                            <Button
                                                color="primary"
                                                variant="contained"
                                                type="submit"
                                                disabled={isSubmitting}
                                            >
                                                Create task
                                            </Button>
                                        </Box>
                                    </form>
                                )}
                            </Formik>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <Typography variant="overline" color="textPrimary" align="center" gutterBottom>
                                Operations pipeline
                            </Typography>

                            <Pipeline readOnly />
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SectionAugmentation;
