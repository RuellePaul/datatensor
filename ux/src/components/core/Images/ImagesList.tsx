import React, {FC} from 'react';
import clsx from 'clsx';
import {useSnackbar} from 'notistack';
import {IconButton, ListItemIcon, Menu, MenuItem, Skeleton, Tooltip, Typography} from '@mui/material';
import {Delete as DeleteIcon, MoreVert as MoreIcon} from '@mui/icons-material';
import Masonry from '@mui/lab/Masonry';
import MasonryItem from '@mui/lab/MasonryItem';
import makeStyles from '@mui/styles/makeStyles';
import DTImage from 'src/components/core/Images/Image';
import useDataset from 'src/hooks/useDataset';
import useImages from 'src/hooks/useImages';
import {Theme} from 'src/theme';
import {ImageProvider} from 'src/store/ImageContext';
import {LAZY_LOAD_BATCH} from 'src/constants';
import {Image} from 'src/types/image';
import api from 'src/utils/api';

interface ImagesListProps {
    pipeline_id?: string;
    className?: string;
}

interface ImageOverlayProps {
    image: Image;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        overflow: 'hidden',
        minHeight: 600
    },
    grid: {
        display: 'flex',
        marginLeft: -10,
        width: 'auto',
        marginRight: 10
    },
    column: {
        paddingLeft: 10,
        backgroundClip: 'padding-box',
        '& > button': {
            margin: theme.spacing(0, 0, 1)
        }
    },
    image: {
        marginBottom: theme.spacing(1)
    },
    icon: {
        position: 'absolute',
        top: theme.spacing(1),
        right: theme.spacing(1),
        width: 32,
        height: 32,
        background: 'rgba(0, 0, 0, 0.25)',
        color: 'white',
        '&:hover': {
            background: 'rgba(0, 0, 0, 0.5)'
        }
    }
}));

const ImageOverlay: FC<ImageOverlayProps> = ({image}) => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);
    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const {dataset, saveDataset} = useDataset();
    const {images, saveImages} = useImages();

    const handleDelete = async () => {
        try {
            await api.delete(`/datasets/${dataset.id}/images/${image.id}`);
            saveImages(images.filter(current => current.id !== image.id));
            saveDataset({...dataset, image_count: dataset.image_count - 1});
            handleCloseMenu();
        } catch (error) {
            enqueueSnackbar(error.message || 'Something went wrong', {
                variant: 'error'
            });
        }
    };

    return (
        <>
            <Tooltip title={<Typography variant="caption">More</Typography>} disableInteractive>
                <IconButton
                    className={classes.icon}
                    onClick={event => {
                        event.stopPropagation();
                        handleOpenMenu(event);
                    }}
                >
                    <MoreIcon />
                </IconButton>
            </Tooltip>

            <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
                <MenuItem key="Delete" onClick={handleDelete}>
                    <ListItemIcon>
                        <DeleteIcon />
                    </ListItemIcon>
                    Delete
                </MenuItem>
            </Menu>
        </>
    );
};

const DTImagesList: FC<ImagesListProps> = ({className, pipeline_id, ...rest}) => {
    const classes = useStyles();

    const {images} = useImages();

    if (images === null) return null;

    if (images.length === 0)
        return (
            <div className={clsx(classes.root, className)} {...rest}>
                <Masonry columns={{xs: 2, sm: 3, md: 4}} spacing={1}>
                    {Array.from(Array(LAZY_LOAD_BATCH), () => null).map((_, index) => (
                        <MasonryItem key={`masonry_skeleton_${index}`}>
                            <Skeleton
                                component="div"
                                animation="wave"
                                width="100%"
                                height={Math.floor(180 + Math.random() * 100)}
                                variant="rectangular"
                            />
                        </MasonryItem>
                    ))}
                </Masonry>
            </div>
        );

    return (
        <div className={clsx(classes.root, className)} {...rest}>
            <Masonry columns={{xs: 2, sm: 3, md: 4}} spacing={1}>
                {images.map((image: Image) => (
                    <MasonryItem key={image.id}>
                        <ImageProvider image={image}>
                            <DTImage
                                className={classes.image}
                                clickable
                                onClick={() => (window.location.hash = image.id)}
                                skeleton
                                overlay={<ImageOverlay image={image} />}
                            />
                        </ImageProvider>
                    </MasonryItem>
                ))}
            </Masonry>
        </div>
    );
};

export default DTImagesList;
