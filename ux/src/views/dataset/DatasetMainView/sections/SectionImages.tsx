import React, {FC, useState} from 'react';
import {useParams} from 'react-router';
import {Box, Button, Dialog, DialogContent, DialogTitle, IconButton, makeStyles, Typography} from '@material-ui/core';
import {Close as CloseIcon} from '@material-ui/icons';
import DTImagesList from 'src/components/ImagesList';
import ImagesDropzone from 'src/components/ImagesDropzone';
import {Theme} from 'src/theme';

const useStyles = makeStyles((theme: Theme) => ({
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

    const [openUpload, setOpenUpload] = useState(false);

    const handleUploadOpen = () => {
        setOpenUpload(true);
    };

    const handleUploadClose = () => {
        setOpenUpload(false);
    };

    return (
        <>
            <Box display='flex' flexDirection='row-reverse'>
                <Box ml={1}>
                    <Button variant="contained" color="primary">
                        Crawl images from the web
                    </Button>
                </Box>

                <Button variant="outlined" color="primary" onClick={handleUploadOpen}>
                    Upload images
                </Button>

                <Dialog
                    open={openUpload}
                    onClose={handleUploadClose}
                >
                    <DialogTitle>
                        <Typography variant="h5">
                            Upload Images
                        </Typography>
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
            </Box>

            <Box mt={3}>
                <DTImagesList/>
            </Box>
        </>
    )
};

export default SectionImage;
