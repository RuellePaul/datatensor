import React, {FC, useEffect, useState} from 'react';
import useEventListener from 'use-typed-event-listener';
import {useSnackbar} from 'notistack';
import {ArrowLeft as BackIcon, MoreVertical as MoreIcon} from 'react-feather';
import {Backdrop, Button, Chip, Dialog, IconButton, makeStyles, Menu, MenuItem, Typography} from '@material-ui/core';
import {Pagination} from '@material-ui/lab';
import {Theme} from 'src/theme';
import api from 'src/utils/api';
import DTImage from 'src/components/datatensor/Images/Image';
import bytesToSize from 'src/utils/bytesToSize';
import useDataset from 'src/hooks/useDataset';
import useImages from 'src/hooks/useImages';
import {ImageProvider} from 'src/store/ImageContext';
import {LAZY_LOAD_BATCH} from 'src/constants';


interface DTImagePreviewProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selected: number;
    setSelected: React.Dispatch<React.SetStateAction<number>>;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(1)
    },
    backdrop: {
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(5px)'
    },
    paper: {
        overflow: 'hidden',
        background: 'rgba(0, 0, 0, 0.6)',
        border: `dashed 2px ${theme.palette.divider}`
    },
    header: {
        width: '100%',
        maxWidth: theme.breakpoints.values.lg,
        padding: theme.spacing(1),
        display: 'flex',
        alignItems: 'center',
    },
    content: {
        minWidth: 100,
        maxWidth: theme.breakpoints.values.lg,
        padding: theme.spacing(2)
    },
    footer: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        padding: theme.spacing(2, 1),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    chip: {
        marginLeft: theme.spacing(1)
    }
}));


const DTImagePreview: FC<DTImagePreviewProps> = ({
                                                     open,
                                                     setOpen,
                                                     selected,
                                                     setSelected
                                                 }) => {

    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    const {dataset, saveDataset} = useDataset();

    const {images, saveImages, saveOffset} = useImages();
    const imageSelected = images[selected];

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const handleClose = () => {
        setOpen(false);
    }

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleDeleteImage = async event => {
        event.stopPropagation();

        try {
            await api.delete(`/datasets/${dataset.id}/images/${imageSelected.id}`);
            setSelected(Math.max(0, selected - 1));
            saveImages(images.filter(image => image.id !== imageSelected.id));
            saveDataset({...dataset, image_count: dataset.image_count - 1})
            handleCloseMenu();
            handleClose();
        } catch (error) {
            enqueueSnackbar(error.message || 'Something went wrong', {variant: 'error'});
        }

    };

    const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setSelected(value - 1);
    };

    const handleKeyDown = async (event: KeyboardEvent) => {
        if (event.key === 'ArrowLeft') {
            if (selected === 0) return;
            setSelected(selected - 1);
        } else if (event.key === 'ArrowRight') {
            if (selected === images.length - 1) return;
            setSelected(selected + 1);
        }
    }

    useEffect(() => {
        if (selected === images.length - 1)
            saveOffset(offset => offset + LAZY_LOAD_BATCH);

        // eslint-disable-next-line
    }, [selected]);

    useEventListener(window, 'keydown', handleKeyDown);

    return (
        <Dialog
            className={classes.root}
            maxWidth="lg"
            open={open}
            onClose={handleClose}
            BackdropComponent={Backdrop}
            BackdropProps={{
                className: classes.backdrop,
            }}
            PaperProps={{
                className: classes.paper
            }}
        >
            <>
                <div className={classes.header}>
                    <Button
                        onClick={handleClose}
                        size='small'
                        startIcon={<BackIcon/>}
                    >
                        Back
                    </Button>
                    <div>
                        <Typography
                            variant='h5'
                            color='textPrimary'
                        >
                            {imageSelected.name}
                        </Typography>
                        <Typography
                            variant='h6'
                            color='textSecondary'
                        >
                            {bytesToSize(imageSelected.size)} ({imageSelected.width} x {imageSelected.height})
                        </Typography>
                    </div>

                    <Chip
                        className={classes.chip}
                        label={imageSelected.pipeline_id ? 'Augmented image' : 'Original image'}
                        size='small'
                        variant='outlined'
                    />

                    <div className='flexGrow'/>

                    <IconButton
                        onClick={handleOpenMenu}
                    >
                        <MoreIcon
                            width={30}
                            height={30}
                            color='white'
                        />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        keepMounted
                        open={openMenu}
                        onClose={handleCloseMenu}
                        PaperProps={{
                            style: {
                                width: '20ch'
                            }
                        }}
                    >
                        <MenuItem onClick={handleDeleteImage}>
                            Delete
                        </MenuItem>
                    </Menu>
                </div>

                <div className={classes.content}>
                    <ImageProvider
                        key={imageSelected.id}
                        image={imageSelected}
                    >
                        <DTImage/>
                    </ImageProvider>
                </div>

                <div className={classes.footer}>
                    <Pagination
                        color='primary'
                        count={images.length}
                        page={selected + 1}
                        onChange={handlePaginationChange}
                    />
                </div>
            </>
        </Dialog>
    );
};

export default DTImagePreview;
