import React, {FC, useEffect, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry from 'react-masonry-css';
import clsx from 'clsx';
import {
    Backdrop,
    Box,
    Button,
    Chip,
    Dialog,
    FormControlLabel,
    Grid,
    IconButton,
    LinearProgress,
    makeStyles,
    Menu,
    MenuItem,
    Switch,
    Tooltip,
    Typography,
    useTheme
} from '@material-ui/core';
import {Pagination, ToggleButton, ToggleButtonGroup} from '@material-ui/lab';
import {Restore as RestoreIcon} from '@material-ui/icons';
import {ArrowLeft as BackIcon, Maximize as LabelIcon, MoreVertical as MoreIcon, Move as MoveIcon} from 'react-feather';
import DTImage from 'src/components/datatensor/Image';
import DTLabelisator from 'src/components/datatensor/Labelisator';
import DTCategories from 'src/components/datatensor/Categories';
import useImages from 'src/hooks/useImages';
import {Theme} from 'src/theme';
import bytesToSize from 'src/utils/bytesToSize';
import useDataset from 'src/hooks/useDataset';
import {CategoryProvider} from 'src/store/CategoryContext';
import {ImageConsumer, ImageProvider} from 'src/store/ImageContext';
import KeyboardShortcuts from 'src/components/overlays/KeyboardShortcuts';
import api from 'src/utils/api'
import {LAZY_LOAD_BATCH} from 'src/constants';

interface ImagesListProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    backdrop: {
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(5px)'
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(1)
    },
    paper: {
        overflow: 'hidden',
        background: 'rgba(0, 0, 0, 0.6)',
        border: `dashed 2px ${theme.palette.divider}`
    },
    actions: {
        display: 'flex',
        alignItems: 'center'
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

const DTImagesList: FC<ImagesListProps> = ({
                                               className,
                                               ...rest
                                           }) => {
    const classes = useStyles();
    const theme = useTheme();

    const {dataset, saveDataset, pipelines} = useDataset();
    const {images, saveImages, saveOffset} = useImages();

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(0);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const imageSelected = images[selected];
    const [tool, setTool] = useState<'label' | 'move'>('label');
    const handleToolChange = (event: React.MouseEvent<HTMLElement>, newTool: 'label' | 'move' | null) => {
        if (newTool !== null)
            setTool(newTool);
    };
    const [autoSwitch, setAutoSwitch] = useState<boolean>(true);

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

    const handleDeleteImage = async event => {
        event.stopPropagation();

        await api.delete(`/datasets/${dataset.id}/images/${imageSelected.id}`);
        setSelected(Math.max(0, selected - 1));
        saveImages(images.filter(image => image.id !== imageSelected.id));
        saveDataset({...dataset, image_count: dataset.image_count - 1})
        handleCloseMenu();
        handleCloseImage();
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

    useEffect(() => {
        if (selected === images.length - 1)
            saveOffset(offset => offset + LAZY_LOAD_BATCH);

        // eslint-disable-next-line
    }, [selected])

    return (
        <div
            className={clsx(classes.root, className)}
            onKeyDown={handleKeyDown}
            {...rest}
        >
            <InfiniteScroll
                className='scroll'
                dataLength={images.length}
                next={() => setTimeout(() => saveOffset(offset => offset + LAZY_LOAD_BATCH), 100)}
                height={'calc(100vh - 300px)'}
                hasMore={dataset.image_count > images.length}
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
                    {images.map((image, index) => (
                        <ImageProvider
                            key={image.id}
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
                    maxWidth="lg"
                    open={open}
                    onClose={handleCloseImage}
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
                            <IconButton
                                onClick={handleCloseImage}
                            >
                                <BackIcon
                                    width={32}
                                    height={32}
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
                                    {bytesToSize(imageSelected.size)} ({imageSelected.width} x {imageSelected.height})
                                </Typography>
                                <Chip
                                    className={classes.chip}
                                    label={imageSelected.pipeline_id ? 'Augmented' : 'Original'}
                                    size='small'
                                    variant='outlined'
                                />

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
                                <CategoryProvider>
                                    <Grid container spacing={4}>
                                        <Grid item md={8} xs={12}>
                                            <div className={classes.actions}>
                                                <ToggleButtonGroup
                                                    value={tool}
                                                    exclusive
                                                    onChange={handleToolChange}
                                                    size='small'
                                                >
                                                    <ToggleButton
                                                        value="label"
                                                        disabled={autoSwitch}
                                                    >
                                                        <Tooltip
                                                            title={<Typography variant='overline'>
                                                                Draw tool (a)
                                                            </Typography>}
                                                        >
                                                            <LabelIcon/>
                                                        </Tooltip>
                                                    </ToggleButton>
                                                    <ToggleButton
                                                        value="move"
                                                        disabled={autoSwitch}
                                                    >
                                                        <Tooltip
                                                            title={<Typography variant='overline'>
                                                                Move tool (z)
                                                            </Typography>}
                                                        >
                                                            <MoveIcon/>
                                                        </Tooltip>
                                                    </ToggleButton>
                                                </ToggleButtonGroup>

                                                <Box ml={3}>
                                                    <FormControlLabel
                                                        control={(
                                                            <Switch
                                                                color="secondary"
                                                                size='small'
                                                                checked={autoSwitch}
                                                                onChange={() => setAutoSwitch(!autoSwitch)}
                                                            />
                                                        )}
                                                        label={(
                                                            <Typography
                                                                color='textSecondary'
                                                            >
                                                                Auto switch
                                                            </Typography>
                                                        )}
                                                    />
                                                </Box>

                                                <div className='flexGrow'/>

                                                <ImageConsumer>
                                                    {
                                                        value => (
                                                            <Tooltip
                                                                title={
                                                                    <Typography variant='overline'>
                                                                        Undo (CTRL + Z)
                                                                    </Typography>
                                                                }
                                                            >
                                                                <IconButton
                                                                    disabled={value.positions.length <= 1}
                                                                    onClick={value.previousPosition}
                                                                >
                                                                    <RestoreIcon/>
                                                                </IconButton>
                                                            </Tooltip>
                                                        )
                                                    }
                                                </ImageConsumer>

                                                <Tooltip
                                                    title={
                                                        <Typography variant='overline'>
                                                            Save (SPACE)
                                                        </Typography>
                                                    }
                                                >
                                        <span>
                                            {<ImageConsumer>
                                                {
                                                    value => (
                                                        <Button
                                                            variant="outlined"
                                                            color="secondary"
                                                            size='small'
                                                            onClick={value.validateLabels}
                                                        >
                                                            Save
                                                        </Button>
                                                    )
                                                }
                                            </ImageConsumer>}
                                        </span>
                                                </Tooltip>
                                            </div>

                                            <DTLabelisator
                                                tool={tool}
                                                setTool={setTool}
                                                autoSwitch={autoSwitch}
                                                selected={selected}
                                                setSelected={setSelected}
                                            />
                                        </Grid>

                                        <Grid item md={4} xs={12}>
                                            <KeyboardShortcuts/>

                                            <Box mt={2}>
                                                <DTCategories/>
                                            </Box>

                                        </Grid>
                                    </Grid>
                                </CategoryProvider>
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
