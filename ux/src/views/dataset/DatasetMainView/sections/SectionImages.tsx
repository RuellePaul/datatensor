import React, {FC, useState} from 'react';
import {useParams} from 'react-router';
import {Box, Button, Dialog, DialogContent, DialogTitle, IconButton, makeStyles, Typography} from '@material-ui/core';
import {Close as CloseIcon} from '@material-ui/icons';
import DTImagesList from 'src/components/datatensor/ImagesList';
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
    close: {
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

    const handleCloseUpload = () => {
        setOpenUpload(false);
    };

    const imagesCount = images.length;

    return (
        <>
            <div className={classes.header}>
                <Typography variant="h4" color="textSecondary">
                    {images.length > 0
                        ? `Showing ${imagesCount} images`
                        : `No images found`
                    }
                </Typography>

                <Box display='flex'>
                    <Button color="primary" onClick={handleUploadOpen} size="small">
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
                        <Typography color='textSecondary' gutterBottom>
                            Upload images of objects that you want to detect
                        </Typography>
                        <ImagesDropzone
                            dataset_id={dataset_id}
                            callback={handleCloseUpload}
                        />
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
