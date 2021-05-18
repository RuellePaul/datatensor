import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {useHistory} from 'react-router';
import clsx from 'clsx';
import {useSnackbar} from 'notistack';
import {
    Box,
    Button,
    capitalize,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    makeStyles,
    Typography
} from '@material-ui/core';
import {Theme} from 'src/theme';
import {Dataset} from 'src/types/dataset';
import api from 'src/utils/api';
import useDatasets from 'src/hooks/useDatasets';
import {Close as CloseIcon} from '@material-ui/icons';
import {Image} from 'src/types/image';
import {DatasetProvider} from 'src/contexts/DatasetContext';
import {ImageProvider} from 'src/contexts/ImageContext';
import DTImage from './Image';

interface DatasetProps {
    className?: string;
    dataset: Dataset;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'relative',
        maxWidth: 460
    },
    area: {
        overflow: 'hidden',
        height: 170,
        '&:hover > div': {
            transform: 'translate(0px, 0px) !important'
        }
    },
    stacked: {
        overflow: 'hidden',
        height: 120,
        position: 'absolute',
        top: 25,
        width: 200,
        border: `solid 2px ${theme.palette.divider}`,
        boxShadow: theme.shadows[2],
        transition: 'all 1s ease'
    },
    close: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    },
    loader: {
        width: '20px !important',
        height: '20px !important'
    }
}));

const DTDataset: FC<DatasetProps> = ({
                                         className,
                                         dataset,
                                         ...rest
                                     }) => {
    const classes = useStyles();
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();

    const {saveDatasets} = useDatasets();

    const datasetRef = useRef(null);

    const [imagesPreview, setImagesPreview] = useState<Image[]>([]);

    const fetchImages = useCallback(async () => {
        try {
            const response = await api.get<{ images: Image[] }>(`/datasets/${dataset._id}/images/`, {
                params: {
                    limit: 8
                }
            });
            setImagesPreview(response.data.images);
        } catch (err) {
            console.error(err);
        }

    }, [dataset._id]);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);


    const [openDeleteDataset, setOpenDeleteDataset] = useState(false);
    const handleOpenDeleteDataset = () => {
        setOpenDeleteDataset(true);
    };
    const handleCloseDeleteDataset = () => {
        setOpenDeleteDataset(false);
    };

    const [isDeleting, setIsDeleting] = useState(false);
    const handleDeleteDataset = async () => {
        setIsDeleting(true);
        try {
            await api.delete(`/datasets/${dataset._id}`);
            saveDatasets(datasets => datasets.filter((current: Dataset) => current._id !== dataset._id));
            enqueueSnackbar(`Deleted dataset ${dataset.name}`, {variant: 'info'});
            setIsDeleting(false);
            handleCloseDeleteDataset();
        } catch (error) {
            enqueueSnackbar(error.message || 'Something went wrong', {variant: 'error'});
        }
    };

    return (
        <Card
            className={clsx(classes.root, className)}
            ref={datasetRef}
            {...rest}
        >
            <CardActionArea
                className={classes.area}
                onClick={() => history.push(`/app/manage/datasets/${dataset._id}`)}
            >
                {imagesPreview.map((image: Image, index) => (
                    <div
                        className={classes.stacked}
                        style={{
                            transform: `translateX(${index * 12}px) rotateX(15deg) rotateY(55deg)`,
                            zIndex: 10 - index
                        }}
                    >
                        <DatasetProvider dataset_id={dataset._id}>
                            <ImageProvider image={image}>
                                <DTImage/>
                            </ImageProvider>
                        </DatasetProvider>
                    </div>
                ))}
            </CardActionArea>
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    {dataset.name && capitalize(dataset.name)}
                </Typography>
                <Typography
                    color="textSecondary"
                    variant="body2"
                    component="p"
                    dangerouslySetInnerHTML={{__html: dataset.description}}
                />
            </CardContent>
            <CardActions>
                <Button
                    color="primary"
                    onClick={handleOpenDeleteDataset}
                    size="small"
                >
                    Delete
                </Button>
            </CardActions>

            <Dialog
                disableRestoreFocus
                fullWidth
                open={openDeleteDataset}
                onClose={handleCloseDeleteDataset}
            >
                <DialogTitle
                    className='flex'
                    disableTypography
                >
                    <Typography variant='h4'>
                        Confirmation
                    </Typography>

                    <IconButton
                        className={classes.close}
                        onClick={handleCloseDeleteDataset}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box my={1}>
                        <Typography color='textPrimary' gutterBottom>
                            Are you sure you want to delete dataset
                            {' '}
                            <Typography component='span' style={{fontWeight: 'bold'}}>
                                {dataset.name}
                            </Typography>
                            {' '}
                            ?
                        </Typography>
                    </Box>

                    <Box display='flex' justifyContent='flex-end'>
                        <Button
                            color="secondary"
                            variant="contained"
                            onClick={handleDeleteDataset}
                            endIcon={isDeleting && (
                                <CircularProgress
                                    className={classes.loader}
                                    color="inherit"
                                />
                            )}
                            disabled={isDeleting}
                        >
                            Delete dataset
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </Card>
    );
};

export default DTDataset;
