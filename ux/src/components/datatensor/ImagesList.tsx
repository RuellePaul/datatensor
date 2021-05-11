import React, {FC, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry from 'react-masonry-css';
import clsx from 'clsx';
import {
    Backdrop,
    Dialog,
    IconButton,
    LinearProgress,
    makeStyles,
    Menu,
    MenuItem,
    Typography,
    useTheme
} from '@material-ui/core';
import {Pagination} from '@material-ui/lab';
import {ArrowLeft as BackIcon, MoreVertical as MoreIcon} from 'react-feather';
import DTImage from 'src/components/datatensor/Image';
import useImages from 'src/hooks/useImages';
import {Theme} from 'src/theme';
import api from 'src/utils/api'
import bytesToSize from 'src/utils/bytesToSize';
import useDataset from 'src/hooks/useDataset';
import {ImageProvider} from 'src/contexts/ImageContext';

interface ImagesListProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    backdrop: {
        background: 'rgba(0, 0, 0, 0.7)'
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(1)
    },
    header: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        padding: theme.spacing(1),
        display: 'flex',
        alignItems: 'center'
    },
    content: {
        position: 'relative',
        minWidth: 100,
        maxWidth: theme.breakpoints.values.lg,
    },
    grid: {
        display: 'flex',
        marginLeft: -10,
        width: 'auto',
    },
    scroll: {
        overflowY: 'auto',
        height: '100%',
        '&::-webkit-scrollbar': {
            width: '0.4em'
        },
        '&::-webkit-scrollbar-track': {
            boxShadow: `inset 0 0 6px ${theme.palette.primary.main}`,
            webkitBoxShadow: `inset 0 0 6px ${theme.palette.primary.main}`
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: `${theme.palette.primary.main}`,
            outline: '1px solid slategrey'
        }
    },
    column: {
        paddingLeft: 10,
        backgroundClip: 'padding-box',
        '& > button': {
            margin: theme.spacing(0, 0, 1)
        }
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
    resolution: {
        position: 'absolute',
        top: -25,
        right: 0
    }
}));

const LAZY_LOAD_BATCH = 20;

const DTImagesList: FC<ImagesListProps> = ({
                                               className,
                                               ...rest
                                           }) => {
    const classes = useStyles();
    const theme = useTheme();

    const {dataset} = useDataset();
    const {images, saveImages} = useImages();

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(0);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const imageSelected = images[selected];

    const [limit, setLimit] = useState(LAZY_LOAD_BATCH);
    const hasMore = images.length > limit;

    const handleOpenImage = (index) => {
        setOpen(true);
        setSelected(index);
    };

    const handleCloseImage = () => {
        setOpen(false);
    };

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleDelete = async event => {
        event.stopPropagation();

        await api.delete(`/datasets/${dataset._id}/images/${imageSelected._id}`);
        setSelected(Math.max(0, selected - 1));
        saveImages(images.filter(image => image._id !== imageSelected._id));
        handleCloseMenu();
        images.length <= 1 && handleCloseImage();
    };

    const handleKeyDown = (event: React.KeyboardEvent<unknown>) => {
        if (event.key === 'ArrowLeft')
            setSelected(Math.max(0, selected - 1));
        else if (event.key === 'ArrowRight')
            setSelected(Math.min(selected + 1, images.length - 1));
    };

    const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setSelected(value - 1);
    };

    return (
        <div
            className={clsx(classes.root, className)}
            onKeyDown={handleKeyDown}
            {...rest}
        >
            <InfiniteScroll
                className={classes.scroll}
                dataLength={limit}
                next={() => {
                    setTimeout(() => setLimit(limit + LAZY_LOAD_BATCH), 100);
                }}
                height={'calc(100vh - 300px)'}
                hasMore={hasMore}
                loader={<LinearProgress/>}
            >
                <Masonry
                    breakpointCols={{
                        default: 4,
                        [theme.breakpoints.values.md]: 3,
                        700: 2
                    }}
                    className={classes.grid}
                    columnClassName={classes.column}
                >
                    {images.slice(0, limit).map((image, index) => (
                        <ImageProvider
                            key={image._id}
                            image={image}
                        >
                            <DTImage
                                clickable
                                onClick={() => handleOpenImage(index)}
                            />
                        </ImageProvider>
                    ))}
                </Masonry>
            </InfiniteScroll>

            {imageSelected && (
                <Dialog
                    className={classes.modal}
                    open={open}
                    onClose={handleCloseImage}
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        className: classes.backdrop,
                    }}
                >
                    <>
                        <div className={classes.header}>
                            <IconButton
                                onClick={handleCloseImage}
                            >
                                <BackIcon
                                    width={40}
                                    height={40}
                                    color='white'
                                />
                            </IconButton>
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
                                    {bytesToSize(imageSelected.size)}
                                </Typography>
                            </div>

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
                                <MenuItem onClick={handleDelete}>
                                    Delete
                                </MenuItem>
                            </Menu>
                        </div>

                        <div className={classes.content}>
                            <div className={classes.resolution}>
                                <Typography
                                    color='textSecondary'
                                >
                                    {imageSelected.width} x {imageSelected.height}
                                </Typography>
                            </div>
                            <ImageProvider
                                key={imageSelected._id}
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
            )}
        </div>
    );
};

export default DTImagesList;
