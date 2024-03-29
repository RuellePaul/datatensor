import React, {FC, useState} from 'react';
import {Button, Dialog, DialogContent, DialogTitle, IconButton} from '@mui/material';
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

interface UploadButtonProps {
    size?: 'small' | 'medium' | 'large'
}

const UploadButton: FC<UploadButtonProps> = ({ size = 'medium' }) => {
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
            <Button variant="contained" color="primary" endIcon={<UploadIcon />} onClick={handleUploadOpen} size={size}>
                Upload images
            </Button>

            <Dialog open={openUpload} onClose={handleCloseUpload}>
                <DialogTitle>
                    Upload images
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
