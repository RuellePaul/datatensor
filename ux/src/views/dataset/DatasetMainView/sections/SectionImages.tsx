import React, {FC, useState} from 'react';
import {useDispatch} from 'react-redux';
import clsx from 'clsx';
import {useSnackbar} from 'notistack';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    makeStyles,
    Typography
} from '@material-ui/core';
import {Close as CloseIcon, Delete} from '@material-ui/icons';
import FancyLabel from 'src/components/FancyLabel';
import ImagesDropzone from 'src/components/ImagesDropzone';
import DTImagesList from 'src/components/datatensor/ImagesList';
import DTImagesStack from 'src/components/datatensor/ImagesStack';
import Pipeline from 'src/components/datatensor/Pipeline';
import useDataset from 'src/hooks/useDataset';
import {setDefaultPipeline, setPipeline} from 'src/slices/pipeline';
import {ImagesProvider} from 'src/store/ImagesContext';
import {Theme} from 'src/theme';
import {SectionProps} from './SectionProps';
import api from 'src/utils/api';
import useTasks from 'src/hooks/useTasks';

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    wrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
            justifyContent: 'center',
            '& > div': {
                margin: theme.spacing(2, 0)
            }
        },
        margin: theme.spacing(2, 0)
    },
    label: {
        margin: theme.spacing(1, 2, 1, 0)
    },
    close: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    expandWrapper: {
        display: 'flex',
        alignItems: 'center',
        margin: theme.spacing(2, 0, 1),
        color: theme.palette.grey[400]
    },
    deleteAction: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.error.main,
        '&:hover': {
            backgroundColor: theme.palette.error.dark
        }
    },
    loader: {
        width: '20px !important',
        height: '20px !important'
    }
}));


const SectionImages: FC<SectionProps> = ({className}) => {

    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const dispatch = useDispatch();

    const {dataset, saveDataset, pipelines, savePipelines} = useDataset();

    const {tasks} = useTasks();

    const [openUpload, setOpenUpload] = useState(false);

    const handleUploadOpen = () => {
        setOpenUpload(true);
    };

    const handleCloseUpload = () => {
        setOpenUpload(false);
    };

    const [openPipeline, setOpenPipeline] = useState(false);

    const handlePipelineOpen = () => {
        if (!pipelineId) return;

        dispatch(setPipeline(pipelines.find(pipeline => pipeline.id === pipelineId)));
        setOpenPipeline(true);
    };

    const handlePipelineClose = () => {
        setOpenPipeline(false);
        dispatch(setDefaultPipeline());
    };

    const [pipelineId, setPipelineId] = useState<string | null>(null);

    const [isDeleting, setIsDeleting] = useState(false);
    const handleDeletePipeline = async () => {
        if (!pipelineId) return;

        setIsDeleting(true);

        try {
            await api.delete(`/datasets/${dataset.id}/pipelines/${pipelineId}`);
            setPipelineId(null);
            saveDataset(dataset => ({...dataset, augmented_count: dataset.augmented_count - pipelines.find(pipeline => pipeline.id === pipelineId).image_count}))
            savePipelines(pipelines => pipelines.filter(pipeline => pipeline.id !== pipelineId));
            enqueueSnackbar(`Deleted pipeline & associated images`, {variant: 'info'});
        } catch (error) {
            enqueueSnackbar(error.message || 'Something went wrong', {variant: 'error'});
        } finally {
            setIsDeleting(false);
        }
    }

    const activeTasksCount = tasks
        ? tasks.filter(task => task.status === 'active' && task.dataset_id === dataset.id).length
        : 0;

    return (
        <div className={clsx(classes.root, className)}>
            <Typography
                variant="h3"
                color="textPrimary"
            >
                All images
            </Typography>

            <FancyLabel
                className={classes.label}
                color='info'
            >
                {dataset.image_count + dataset.augmented_count} images
            </FancyLabel>
            <FancyLabel
                className={classes.label}
                color='default'
            >
                {dataset.image_count} original
            </FancyLabel>
            <FancyLabel
                className={classes.label}
                color='default'
            >
                + {dataset.augmented_count} augmented
            </FancyLabel>


            <Box display='flex'>
                <Button variant='contained' color="primary" onClick={handleUploadOpen} size="small">
                    Upload images
                </Button>
            </Box>

            <Dialog
                open={openUpload}
                onClose={handleCloseUpload}
            >
                <DialogTitle disableTypography>
                    <Typography variant='h4'>
                        Upload Images
                    </Typography>
                    <IconButton
                        className={classes.close}
                        onClick={handleCloseUpload}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography
                        color='textSecondary'
                        gutterBottom
                    >
                        Upload images of objects that you want to detect
                    </Typography>
                    <ImagesDropzone
                        callback={handleCloseUpload}
                    />
                </DialogContent>
            </Dialog>

            <div
                className={classes.wrapper}
            >
                <Box
                    display='flex'
                    flexDirection='column'
                    justifyContent='center'
                    alignItems='center'
                    width='100%'
                >
                    <Typography
                        variant='overline'
                        color='textPrimary'
                        gutterBottom
                        align='center'
                    >
                        Original images ({dataset.image_count})
                    </Typography>
                    <DTImagesStack
                        onClick={() => setPipelineId(null)}
                    />
                </Box>

                {pipelines.map(pipeline => (
                    <ImagesProvider
                        key={pipeline.id}
                    >
                        <Box
                            display='flex'
                            flexDirection='column'
                            justifyContent='center'
                            alignItems='center'
                            width='100%'
                        >
                            <Typography
                                variant='overline'
                                color='textPrimary'
                                gutterBottom
                                align='center'
                            >
                                Augmented images ({pipeline.image_count})
                            </Typography>
                            <DTImagesStack
                                onClick={() => setPipelineId(pipeline.id)}
                            />
                        </Box>
                    </ImagesProvider>
                ))}
            </div>

            <Box
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                py={2}
            >
                <Button
                    onClick={handlePipelineOpen}
                >
                    View operations pipeline
                </Button>

                <Button
                    className={clsx((activeTasksCount === 0 && !isDeleting) && classes.deleteAction)}
                    variant='outlined'
                    startIcon={<Delete/>}
                    endIcon={isDeleting && (
                        <CircularProgress
                            className={classes.loader}
                            color="inherit"
                        />
                    )}
                    onClick={handleDeletePipeline}
                    size='small'
                    disabled={isDeleting || activeTasksCount > 0}
                >
                    Delete pipeline
                </Button>
            </Box>

            <DTImagesList/>

            <Dialog
                disableRestoreFocus
                fullWidth
                maxWidth='xs'
                open={openPipeline}
                onClose={handlePipelineClose}
            >
                <DialogTitle
                    className='flex'
                    disableTypography
                >
                    <Typography variant='h4'>
                        Operations pipeline
                    </Typography>

                    <IconButton
                        className={classes.close}
                        onClick={handlePipelineClose}
                    >
                        <CloseIcon fontSize="large"/>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Pipeline readOnly/>
                </DialogContent>
            </Dialog>
        </div>
    )
};

export default SectionImages;
