import React, {FC} from 'react';
import clsx from 'clsx';
import {useSnackbar} from 'notistack';
import {IconButton, ListItemIcon, Menu, MenuItem, Skeleton, Tooltip, Typography} from '@mui/material';
import {CreateOutlined as EditIcon, Delete as DeleteIcon, MoreVert as MoreIcon} from '@mui/icons-material';
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
import goToHash from 'src/utils/goToHash';
import useCategory from '../../../hooks/useCategory';

interface ImagesListProps {
    className?: string;
    onClick?: (image: Image) => void;
}

interface ImageOverlayProps {
    image: Image;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        overflow: 'hidden'
    },
    filled: {
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

    const handleOpenLabelisator = () => {
        goToHash(image.id);
        handleCloseMenu();
    };

    const handleDelete = async () => {
        try {
            const response = await api.delete<{deleted_count: number}>(`/datasets/${dataset.id}/images/${image.id}`);
            saveImages(images.filter(current => current.id !== image.id));
            saveDataset({
                ...dataset,
                image_count: dataset.image_count - 1,
                augmented_count: dataset.augmented_count - (response.data.deleted_count - 1)
            });
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
                <MenuItem key="Edit" onClick={handleOpenLabelisator}>
                    <ListItemIcon>
                        <EditIcon />
                    </ListItemIcon>
                    Edit
                </MenuItem>
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

const DTImagesList: FC<ImagesListProps> = ({className, onClick = () => {}, ...rest}) => {
    const classes = useStyles();

    const {images} = useImages();
    const {currentCategory} = useCategory();

    if (images === null)
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

    if (images.length === 0) return null;

    return (
        <div className={clsx(classes.root, className, images.length >= LAZY_LOAD_BATCH && classes.filled)} {...rest}>
            <Masonry columns={{xs: 2, sm: 3, md: 4}} spacing={1}>
                {images.map((image: Image) => (
                    <MasonryItem key={image.id}>
                        <ImageProvider image={image} labels={image.labels}>
                            <DTImage
                                className={classes.image}
                                clickable
                                onClick={() => onClick(image)}
                                skeleton
                                overlay={<ImageOverlay image={image} />}
                                highlightCategory={currentCategory}
                            />
                        </ImageProvider>
                    </MasonryItem>
                ))}
            </Masonry>
        </div>
    );
};

export default DTImagesList;
