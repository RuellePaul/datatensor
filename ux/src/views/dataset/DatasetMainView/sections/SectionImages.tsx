import React, {FC, useState} from 'react';
import {Box, Button, Dialog, DialogContent, DialogTitle, IconButton, makeStyles, Typography} from '@material-ui/core';
import {Close as CloseIcon} from '@material-ui/icons';
import DTImagesList from 'src/components/datatensor/ImagesList';
import ImagesDropzone from 'src/components/ImagesDropzone';
import useImages from 'src/hooks/useImages';
import {Theme} from 'src/theme';
import useDataset from 'src/hooks/useDataset';
import {SectionProps} from './SectionProps';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
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


const SectionImages: FC<SectionProps> = ({className}) => {

    const classes = useStyles();

    const {dataset} = useDataset();

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
        <div className={clsx(classes.root, className)}>
            <div className={classes.header}>
                <Typography variant="h4" color="textSecondary">
                    {images.length > 0
                        ? `Showing ${imagesCount} / ${dataset.image_count} images`
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

            <Box mt={3}>
                <DTImagesList/>
            </Box>
        </div>
    )
};

export default SectionImages;
