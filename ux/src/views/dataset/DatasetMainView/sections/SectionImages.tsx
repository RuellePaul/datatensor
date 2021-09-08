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
    Tab,
    Tabs,
    Typography
} from '@material-ui/core';
import {Close as CloseIcon, Delete} from '@material-ui/icons';
import ImagesDropzone from 'src/components/ImagesDropzone';
import DTImagesList from 'src/components/datatensor/ImagesList';
import Pipeline from 'src/components/datatensor/Pipeline';
import useDataset from 'src/hooks/useDataset';
import useImages from 'src/hooks/useImages';
import {setDefaultPipeline, setPipeline} from 'src/slices/pipeline';
import {ImagesProvider} from 'src/store/ImagesContext';
import {Theme} from 'src/theme';
import {SectionProps} from './SectionProps';
import api from 'src/utils/api';
import useTasks from 'src/hooks/useTasks';

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
            content: '" "',
            height: 3,
            width: 48,
            backgroundColor: theme.palette.primary.main
        }
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

function TabPanel(props) {
    const {children, value, index} = props;

    return (
        <>
            {(index instanceof Array ? index.includes(value) : value === index) && (
                children
            )}
        </>
    );
}


const SectionImages: FC<SectionProps> = ({className}) => {

    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const dispatch = useDispatch();

    const {dataset, pipelines, savePipelines} = useDataset();

    const {tasks} = useTasks();
    const {images} = useImages();

    const [subTab, setSubTab] = React.useState(0);

    const handleChangeSubTab = (event, newValue) => {
        setSubTab(newValue);
    };

    const [openUpload, setOpenUpload] = useState(false);

    const handleUploadOpen = () => {
        setOpenUpload(true);
    };

    const handleCloseUpload = () => {
        setOpenUpload(false);
    };

    const [openPipeline, setOpenPipeline] = useState(false);

    const handlePipelineOpen = () => {
        dispatch(setPipeline(pipelines.find(pipeline => pipeline.id === pipelineId)));
        setOpenPipeline(true);
    };

    const handlePipelineClose = () => {
        setOpenPipeline(false);
        dispatch(setDefaultPipeline());
    };

    const imagesCount = images.length;

    const [pipelineId, setPipelineId] = useState<string | null>(null);

    const [isDeleting, setIsDeleting] = useState(false);
    const handleDeletePipeline = async () => {
        if (!pipelineId) return;

        setIsDeleting(true);

        try {
            await api.delete(`/datasets/${dataset.id}/pipelines/${pipelineId}`);
            setPipelineId(null);
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
            <div className={classes.header}>
                <Typography
                    className={classes.title}
                    variant="h5"
                    color="textPrimary"
                >
                    {images.length > 0
                        ? <>
                            {dataset.image_count}
                            {' '}
                            <span className="smaller">(+{dataset.augmented_count})</span>
                            {' '}
                            image{(dataset.image_count + dataset.augmented_count) > 1 ? 's' : ''}
                        </>
                        : `No images found`
                    }
                </Typography>

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
            </div>

            <Box mb={2}>
                <Tabs
                    centered
                    value={subTab}
                    onChange={handleChangeSubTab}
                >
                    <Tab
                        label={
                            <Typography color='textPrimary' variant='overline'>
                                Original • {dataset.image_count}
                            </Typography>
                        }
                    />
                    {pipelines.map(pipeline => (
                        <Tab
                            label={
                                <Typography color='textPrimary' variant='overline'>
                                    Augmented • {pipeline.image_count}
                                </Typography>
                            }
                            key={pipeline.id}
                            onClick={() => setPipelineId(pipeline.id)}
                        />
                    ))}
                </Tabs>

            </Box>
            <TabPanel value={subTab} index={0}>
                <DTImagesList/>
            </TabPanel>
            <TabPanel value={subTab} index={[1, 2]}>
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

                <ImagesProvider
                    key={pipelineId}
                    pipeline_id={pipelineId}
                >
                    <DTImagesList
                        pipeline_id={pipelineId}
                    />
                </ImagesProvider>
            </TabPanel>
        </div>
    )
};

export default SectionImages;
