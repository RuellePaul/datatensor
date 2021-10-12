import React, {FC, useState} from 'react';
import {Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Typography} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {Close as CloseIcon, PublishOutlined as UploadIcon} from '@mui/icons-material';
import ImagesDropzone from 'src/components/ImagesDropzone';
import {Theme} from 'src/theme';

const useStyles = makeStyles((theme: Theme) => ({
    close: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    }
}));

const UploadButton: FC = () => {
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
            <Box display="flex">
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<UploadIcon />}
                    onClick={handleUploadOpen}
                >
                    Upload images
                </Button>
            </Box>

            <Dialog open={openUpload} onClose={handleCloseUpload}>
                <DialogTitle>
                    <Typography variant="h4">Upload Images</Typography>
                    <IconButton className={classes.close} onClick={handleCloseUpload} size="large">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <ImagesDropzone callback={handleCloseUpload} />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default UploadButton;
