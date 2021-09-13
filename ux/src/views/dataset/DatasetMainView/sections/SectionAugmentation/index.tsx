import React, {FC, useCallback, useEffect, useState} from 'react';
import clsx from 'clsx';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useSnackbar} from 'notistack';
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormHelperText,
    Grid,
    IconButton,
    makeStyles,
    TextField,
    Typography
} from '@material-ui/core';
import {Close as CloseIcon, Refresh} from '@material-ui/icons';
import {Alert} from '@material-ui/lab';
import {Theme} from 'src/theme';
import Pipeline from 'src/components/datatensor/Pipeline';
import PipelineSample from 'src/components/datatensor/PipelineSample';
import DTImage from 'src/components/datatensor/Images/Image';
import useImages from 'src/hooks/useImages';
import {ImageProvider} from 'src/store/ImageContext';
import {SectionProps} from '../SectionProps';
import api from 'src/utils/api';
import {Task} from 'src/types/task';
import useTasks from 'src/hooks/useTasks';
import useDataset from 'src/hooks/useDataset';
import {useSelector} from 'src/store';
import {Operation} from 'src/types/pipeline';

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        position: 'relative',
        '&:after': {
            position: 'absolute',
            bottom: -8,
            left: 0,
            content: '""',
            height: 3,
            width: 48,
            backgroundColor: theme.palette.primary.main
        }
    },
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

    const [randomIndex, setRandomIndex] = useState<number | null>(0);

    const [openAugmentation, setOpenAugmentation] = useState<boolean>(false);

    const handleOpen = () => {
        setOpenAugmentation(true);
    }

    const handleClose = () => {
        setOpenAugmentation(false);
    }

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

        // eslint-disable-next-line
    }, [images]);

    const pipeline = useSelector<any>((state) => state.pipeline);
    const operations: Operation[] = pipeline.operations.allIds.map(id => pipeline.operations.byId[id]);

    return (
        <div className={clsx(classes.root, className)}>
            <div className={classes.header}>
                <Typography
                    className={classes.title}
                    variant='h5'
                    color='textPrimary'
                >
                    Images augmentation
                </Typography>

                <Box
                    display='flex'
                >
                    <Button
                        variant='contained'
                        color='primary'
                        size='small'
                        onClick={handleOpen}
                    >
                        Augment images
                    </Button>
                </Box>
            </div>

            <Box my={2}>
                <Typography
                    color='textSecondary'
                    gutterBottom
                >
                    Choose operations pipeline that fit the best for your dataset.
                </Typography>
            </Box>

            <ImageProvider
                image={images[randomIndex]}
            >
                <Grid
                    container
                    spacing={3}
                >
                    <Grid
                        item
                        md={3}
                        sm={6}
                        xs={12}
                    >
                        <Typography
                            variant='overline'
                            color='textPrimary'
                            align='center'
                            gutterBottom
                        >
                            Input image
                        </Typography>

                        <div className={classes.wrapper}>
                            <Button
                                className={classes.refresh}
                                onClick={pickRandomImage}
                                startIcon={<Refresh/>}
                                size='small'
                                disabled={images.length < 2}
                            >
                                Random image
                            </Button>

                            <DTImage/>
                        </div>
                    </Grid>
                    <Grid
                        item
                        md={3}
                        sm={6}
                        xs={12}
                    >
                        <Typography
                            variant='overline'
                            color='textPrimary'
                            align='center'
                            gutterBottom
                        >
                            Operations pipeline
                        </Typography>

                        <Pipeline/>
                    </Grid>
                    <Grid
                        item
                        md={6}
                        xs={12}
                    >
                        <Typography
                            variant='overline'
                            color='textPrimary'
                            align='center'
                            gutterBottom
                        >
                            Sample
                        </Typography>

                        <PipelineSample/>
                    </Grid>
                </Grid>
            </ImageProvider>

            <Dialog
                closeAfterTransition
                disableRestoreFocus
                PaperProps={{
                    className: classes.dialog
                }}
                fullWidth
                maxWidth='sm'
                open={openAugmentation}
                onClose={handleClose}
            >
                <DialogTitle
                    className='flex'
                    disableTypography
                >
                    <Typography variant='h4'>
                        Augmentation
                    </Typography>

                    <IconButton
                        className={classes.close}
                        onClick={handleClose}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent
                    className='scroll'
                >
                    <Grid
                        container
                        spacing={2}
                    >
                        <Grid
                            item
                            sm={6}
                            xs={12}
                        >
                            <Formik
                                initialValues={{
                                    image_count: dataset.image_count * 2,
                                    submit: null
                                }}
                                validationSchema={Yup.object().shape({
                                    image_count: Yup.number().min(1).max(10 * dataset.image_count),
                                })}
                                onSubmit={async (values, {
                                    setErrors,
                                    setStatus,
                                    setSubmitting
                                }) => {
                                    try {
                                        const response = await api.post<{ task: Task }>(`/datasets/${dataset.id}/tasks/`, {
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
                                        onSubmit={handleSubmit}
                                        className={clsx(classes.root, className)}
                                    >
                                        <Typography
                                            variant='overline'
                                            color='textPrimary'
                                            align='center'
                                            gutterBottom
                                        >
                                            Properties
                                        </Typography>

                                        <Box my={1}>
                                            <TextField
                                                error={Boolean(touched.image_count && errors.image_count)}
                                                helperText={touched.image_count && errors.image_count}
                                                fullWidth
                                                label='Image count'
                                                name='image_count'
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                type='number'
                                                value={values.image_count}
                                                variant='outlined'
                                            />
                                        </Box>

                                        <Box mt={2} mb={3}>
                                            <Alert
                                                severity='info'
                                            >
                                                There are
                                                {' '}
                                                <strong>
                                                    {dataset.image_count} original images
                                                </strong>
                                                {' '}
                                                in your dataset, so you can generate up to
                                                {' '}
                                                <strong>
                                                    {dataset.image_count * 10} new images
                                                </strong>
                                                .
                                            </Alert>
                                        </Box>

                                        {errors.submit && (
                                            <Box mt={3}>
                                                <FormHelperText error>
                                                    {errors.submit}
                                                </FormHelperText>
                                            </Box>
                                        )}

                                        <Box mt={2}>
                                            <Button
                                                color='secondary'
                                                variant='contained'
                                                type='submit'
                                                disabled={isSubmitting}
                                            >
                                                Create task
                                            </Button>
                                        </Box>
                                    </form>
                                )}
                            </Formik>
                        </Grid>
                        <Grid
                            item
                            sm={6}
                            xs={12}
                        >
                            <Typography
                                variant='overline'
                                color='textPrimary'
                                align='center'
                                gutterBottom
                            >
                                Operations pipeline
                            </Typography>

                            <Pipeline readOnly/>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </div>
    )
};

export default SectionAugmentation;
