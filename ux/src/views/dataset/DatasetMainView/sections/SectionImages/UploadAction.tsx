import React, {FC, useState} from 'react';
import {Box, Button, Dialog, DialogContent, DialogTitle, IconButton, makeStyles, Typography} from '@material-ui/core';
import {Close as CloseIcon} from '@material-ui/icons';
import ImagesDropzone from 'src/components/ImagesDropzone';
import {Theme} from 'src/theme';

const useStyles = makeStyles((theme: Theme) => ({
    close: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    }
}));


const UploadAction: FC = () => {

    const classes = useStyles();

    const [openUpload, setOpenUpload] = useState(false);

    const handleUploadOpen = () => {
        setOpenUpload(true);
    };

    const handleCloseUpload = () => {
        setOpenUpload(false);
    };

    return (
        <>
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
        </>
    )
};

export default UploadAction;