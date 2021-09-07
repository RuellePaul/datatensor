import React, {FC, useState} from 'react';
import {useDispatch} from 'react-redux';
import clsx from 'clsx';
import {Box, Button, Dialog, DialogContent, DialogTitle, IconButton, makeStyles, Typography} from '@material-ui/core';
import {Close as CloseIcon, KeyboardArrowDown as ArrowDownIcon} from '@material-ui/icons';
import ImagesDropzone from 'src/components/ImagesDropzone';
import DTImagesList from 'src/components/datatensor/ImagesList';
import Pipeline from 'src/components/datatensor/Pipeline';
import useDataset from 'src/hooks/useDataset';
import useImages from 'src/hooks/useImages';
import {setDefaultPipeline, setPipeline} from 'src/slices/pipeline';
import {ImagesProvider} from 'src/store/ImagesContext';
import {Theme} from 'src/theme';
import {SectionProps} from './SectionProps';

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
    }
}));


const SectionImages: FC<SectionProps> = ({className}) => {

    const classes = useStyles();
    const dispatch = useDispatch();

    const {dataset, pipelines} = useDataset();

    const {images} = useImages();

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

    return (
        <div className={clsx(classes.root, className)}>
            <div className={classes.header}>
                <Typography
                    className={classes.title}
                    variant="h5"
                    color="textPrimary"
                >
                    {images.length > 0
                        ? `Showing ${dataset.image_count} image${dataset.image_count > 1 ? 's' : ''}`
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

            <Box
                display='flex'
                alignItems='center'
            >
                <Button
                    className={classes.expandWrapper}
                    onClick={() => setPipelineId(null)}
                >
                    <ArrowDownIcon fontSize='large'/>
                    <Box ml={1} mr={3}>
                        <Typography variant='overline'>
                            Original images ({imagesCount} / {dataset.image_count})
                        </Typography>
                    </Box>
                </Button>

                {pipelines.map(pipeline => (
                    <Button
                        className={classes.expandWrapper}
                        key={pipeline.id}
                        onClick={() => setPipelineId(pipeline.id)}
                    >
                        <ArrowDownIcon fontSize='large'/>
                        <Box ml={1} mr={3}>
                            <Typography variant='overline'>
                                Augmented images ({pipeline.image_count})
                            </Typography>
                        </Box>
                    </Button>
                ))}
            </Box>

            {
                pipelineId
                    ? (
                        <>
                            <Button
                                onClick={handlePipelineOpen}
                            >
                                View operations pipeline
                            </Button>

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
                        </>
                    )
                    : <DTImagesList/>
            }
        </div>
    )
};

export default SectionImages;
