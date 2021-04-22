import React, {FC, useState} from 'react';
import {useParams} from 'react-router';
import {Box, Button, Dialog, DialogContent, DialogTitle, IconButton, makeStyles, Typography} from '@material-ui/core';
import {Close as CloseIcon} from '@material-ui/icons';
import DTImagesList from 'src/components/ImagesList';
import ImagesDropzone from 'src/components/ImagesDropzone';
import useImages from 'src/hooks/useImages';
import {Theme} from 'src/theme';

const useStyles = makeStyles((theme: Theme) => ({
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        [theme.breakpoints.down('xs')]: {
            alignItems: 'flex-start',
            flexDirection: 'column',
            '& h4': {
                margin: theme.spacing(0, 0, 1)
            }
        }
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    }
}));


const SectionImage: FC = () => {

    const classes = useStyles();
    const {dataset_id} = useParams();

    const {images} = useImages();

    const [openUpload, setOpenUpload] = useState(false);

    const handleUploadOpen = () => {
        setOpenUpload(true);
    };

    const handleUploadClose = () => {
        setOpenUpload(false);
    };

    const imagesCount = images.length;
    const labelsCount = images.map(image => image.labels.length).reduce((acc, val) => acc + val, 0);

    return (
        <>
            <div className={classes.header}>
                <Typography variant="h4" color="textSecondary">
                    {images.length > 0
                        ? `Showing ${imagesCount} images & ${labelsCount} labels`
                        : `No images found`
                    }
                </Typography>

                <Box display='flex'>
                    <Button variant="outlined" color="primary" onClick={handleUploadOpen} size="small">
                        Upload images
                    </Button>
                    <Box ml={1}>
                        <Button variant="contained" color="primary" size="small">
                            Crawl images from the web
                        </Button>
                    </Box>
                </Box>

                <Dialog
                    open={openUpload}
                    onClose={handleUploadClose}
                >
                    <DialogTitle>
                        Upload Images
                        <IconButton
                            className={classes.closeButton}
                            onClick={handleUploadClose}
                        >
                            <CloseIcon/>
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <ImagesDropzone dataset_id={dataset_id}/>
                    </DialogContent>
                </Dialog>
            </div>

            <Box mt={3}>
                <DTImagesList/>
            </Box>
        </>
    )
};

export default SectionImage;
