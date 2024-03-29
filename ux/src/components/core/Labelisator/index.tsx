import React, {FC, forwardRef, useCallback, useEffect, useState} from 'react';
import clsx from 'clsx';
import {Maximize as LabelIcon, Move as MoveIcon} from 'react-feather';
import {
    AppBar,
    Badge,
    Box,
    Button,
    capitalize,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    Divider,
    FormControlLabel,
    Grid,
    Hidden,
    IconButton,
    Slide,
    Slider,
    Switch,
    ToggleButton,
    ToggleButtonGroup,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {TransitionProps} from '@mui/material/transitions';
import {
    BrandingWatermarkOutlined as LabelisatorIcon,
    Close as CloseIcon,
    ImageOutlined as ImageIcon,
    Restore as RestoreIcon
} from '@mui/icons-material';
import DTCategories from 'src/components/core/Labelisator/Categories';
import DTImage from 'src/components/core/Images/Image';
import Scrollbar from 'src/components/utils/Scrollbar';
import KeyboardListener from './KeyboardListener';
import KeyboardShortcuts from './KeyboardShortcuts';
import NextUnlabeledImageAction from './NextUnlabeledImageAction';
import ToolLabel from './ToolLabel';
import ToolMove from './ToolMove';
import {Theme} from 'src/theme';
import useDataset from 'src/hooks/useDataset';
import useCategory from 'src/hooks/useCategory';
import {Image} from 'src/types/image';
import api from 'src/utils/api';
import {ImagesConsumer, ImagesProvider} from 'src/store/ImagesContext';
import {ImageConsumer, ImageProvider} from 'src/store/ImageContext';
import goToHash from 'src/utils/goToHash';
import {CANVAS_OFFSET} from 'src/utils/labeling';

interface DTLabelisatorProps {}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    paper: {
        overflow: 'hidden',
        background: theme.palette.background.default
    },
    container: {
        touchAction: 'pan-y'
    },
    labelisator: {
        position: 'relative',
        margin: `${CANVAS_OFFSET}px 0px`,
        [theme.breakpoints.down('sm')]: {
            marginLeft: -10,
            marginRight: -10,
            marginBottom: -10
        }
    },
    image: {
        opacity: 0.75,
        transition: 'all 0.15s ease-in-out'
    },
    selected: {
        opacity: 1,
        outline: `solid 3px ${theme.palette.primary.main}`
    },
    content: {
        padding: theme.spacing(2, 0)
    },
    header: {
        position: 'relative',
        background: theme.palette.primary.main
    },
    toolbar: {
        alignItems: 'center',
        color: theme.palette.getContrastText(theme.palette.text.primary)
    },
    loader: {
        display: 'block',
        width: '20px !important',
        height: '20px !important'
    }
}));

const Transition = forwardRef(function Transition(
    props: TransitionProps & {children?: React.ReactElement},
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const hasUUIDHashes = () => {
    if (window.location.hash.length === 0) return false;

    for (const hash of window.location.hash.split('#')) {
        if (UUID_REGEX.test(hash)) return true;
    }
    return false;
};

const DTLabelisator: FC<DTLabelisatorProps> = () => {
    const classes = useStyles();

    const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

    const {dataset} = useDataset();
    const {currentCategory, saveCurrentCategory} = useCategory();

    const [tool, setTool] = useState<'label' | 'move'>('label');
    const handleToolChange = (event: React.MouseEvent<HTMLElement>, newTool: 'label' | 'move' | null) => {
        if (newTool !== null) setTool(newTool);
    };

    const [autoSwitch, setAutoSwitch] = useState<boolean>(isDesktop);

    useEffect(() => {
        setAutoSwitch(isDesktop);
        setTool('move');
    }, [isDesktop, setAutoSwitch]);

    const [imageIds, setImageIds] = useState<string[]>([]);

    const [open, setOpen] = useState<boolean>(hasUUIDHashes());

    const handleClose = () => {
        setOpen(false);
        saveCurrentCategory(null);
        window.location.replace(`#`);
    };

    const fetchImageIds = useCallback(async () => {
        if (imageIds.length > 0) return;

        try {
            const response = await api.get<{image_ids: string[]}>(`/datasets/${dataset.id}/images/ids`);
            setImageIds(response.data.image_ids);
        } catch (err) {
            console.error(err);
        }
    }, [dataset.id, imageIds]);

    useEffect(() => {
        if (open) fetchImageIds();
    }, [fetchImageIds, open]);

    const image_id = window.location.hash.split('#')[1];

    const [image, setImage] = useState<Image>(null);
    const [imageAugmented, setImageAugmented] = useState<Image>(null);

    const fetchImage = useCallback(async () => {
        if (!image_id) return;

        setImage(null);
        setImageAugmented(null);

        try {
            const response = await api.get<{image: Image}>(`/datasets/${dataset.id}/images/${image_id}`);
            setImage(response.data.image);
        } catch (err) {
            console.error(err);
        }
    }, [dataset.id, image_id]);

    const handleSliderChange = (event, value) => {
        try {
            setImage(null);
            setImageAugmented(null);
            goToHash(imageIds[value]);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchImage();
    }, [fetchImage]);

    useEffect(() => {
        const onHashChange = () => setOpen(hasUUIDHashes());
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);

        // eslint-disable-next-line
    }, []);

    const [index, setIndex] = useState<number>(0);
    useEffect(() => {
        setIndex(imageIds.indexOf(image_id));
    }, [imageIds, image_id]);

    return (
        <Dialog
            className={classes.root}
            PaperProps={{className: classes.paper}}
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
            keepMounted
        >
            <ImageProvider image={imageAugmented || image}>
                <Scrollbar>
                    <AppBar className={classes.header}>
                        <Toolbar className={classes.toolbar}>
                            <Box mr={2}>
                                <LabelisatorIcon color="inherit" />
                            </Box>
                            <Typography variant="h4" color="inherit">
                                Labelisator
                            </Typography>
                            <Box flexGrow={1} />
                            <Hidden smDown>
                                <Box mr={2}>
                                    <KeyboardShortcuts />
                                </Box>
                            </Hidden>
                            <IconButton edge="start" color="inherit" onClick={handleClose} size="large">
                                <CloseIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>

                    <Container maxWidth="xl" className={classes.container}>
                        <Grid className={classes.content} container spacing={3}>
                            <Grid item md={8} xs={12}>
                                <Box display="flex" alignItems="center">
                                    <Box mr={1}>
                                        <ImageIcon />
                                    </Box>
                                    <Typography variant="overline" color="textPrimary">
                                        Image {imageIds.indexOf(image_id) + 1} / {imageIds.length}
                                    </Typography>
                                </Box>

                                <Box display="flex" alignItems="center">
                                    <Slider
                                        min={0}
                                        max={imageIds.length - 1}
                                        valueLabelDisplay="auto"
                                        defaultValue={imageIds.indexOf(image_id)}
                                        onClick={event => event.stopPropagation()}
                                        onChangeCommitted={handleSliderChange}
                                        valueLabelFormat={x => x + 1}
                                        value={index}
                                        onChange={(event, value) => setIndex(value as number)}
                                        disabled={imageIds.length === 0}
                                    />

                                    <NextUnlabeledImageAction index={index} />
                                </Box>

                                <Divider sx={{my: 2}} />

                                <Box display="flex" alignItems="center">
                                    <Hidden smDown>
                                        <ToggleButtonGroup
                                            value={tool}
                                            exclusive
                                            onChange={handleToolChange}
                                            size="small"
                                        >
                                            <ToggleButton value="label" disabled={autoSwitch}>
                                                <Tooltip
                                                    title={
                                                        <Typography variant="overline">
                                                            Draw
                                                            <kbd>A</kbd>
                                                        </Typography>
                                                    }
                                                >
                                                    <LabelIcon />
                                                </Tooltip>
                                            </ToggleButton>
                                            <ToggleButton value="move" disabled={autoSwitch}>
                                                <Tooltip
                                                    title={
                                                        <Typography variant="overline">
                                                            Move
                                                            <kbd>Z</kbd>
                                                        </Typography>
                                                    }
                                                >
                                                    <MoveIcon />
                                                </Tooltip>
                                            </ToggleButton>
                                        </ToggleButtonGroup>
                                    </Hidden>

                                    <Hidden smDown>
                                        <Box ml={2}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        color="primary"
                                                        size="small"
                                                        checked={autoSwitch}
                                                        onChange={() => setAutoSwitch(!autoSwitch)}
                                                    />
                                                }
                                                label={<Typography color="textSecondary">Auto switch</Typography>}
                                            />
                                        </Box>

                                        <div className="flexGrow" />
                                    </Hidden>

                                    {currentCategory && (
                                        <Chip
                                            label={
                                                <Typography variant="body2">
                                                    <strong>{capitalize(currentCategory.name)}</strong>
                                                </Typography>
                                            }
                                            title={`${capitalize(currentCategory.name)} | ${capitalize(
                                                currentCategory.supercategory
                                            )}`}
                                            size="medium"
                                            variant="outlined"
                                        />
                                    )}

                                    <div className="flexGrow" />

                                    <ImageConsumer>
                                        {value => (
                                            <Box mr={1}>
                                                <IconButton
                                                    disabled={value.positions.length <= 1}
                                                    onClick={value.previousPosition}
                                                    size="large"
                                                >
                                                    <Tooltip
                                                        title={
                                                            <Typography variant="overline">
                                                                Undo
                                                                <kbd>CTRL</kbd>+<kbd>Z</kbd>
                                                            </Typography>
                                                        }
                                                    >
                                                        <Badge
                                                            color="primary"
                                                            badgeContent={
                                                                value.positions.length > 1
                                                                    ? value.positions.length - 1
                                                                    : 0
                                                            }
                                                            max={99}
                                                        >
                                                            <RestoreIcon />
                                                        </Badge>
                                                    </Tooltip>
                                                </IconButton>
                                            </Box>
                                        )}
                                    </ImageConsumer>

                                    <Tooltip
                                        title={
                                            <Typography variant="overline">
                                                Save
                                                <kbd>S</kbd>
                                            </Typography>
                                        }
                                    >
                                        <span>
                                            {
                                                <ImageConsumer>
                                                    {value => (
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            size="small"
                                                            onClick={value.validateLabels}
                                                            disabled={value.positions.length <= 1}
                                                        >
                                                            Save
                                                        </Button>
                                                    )}
                                                </ImageConsumer>
                                            }
                                        </span>
                                    </Tooltip>
                                </Box>

                                {image || imageAugmented ? (
                                    <div className={classes.labelisator}>
                                        <div className={clsx(tool !== 'label' && 'hidden')}>
                                            <ToolLabel setTool={setTool} autoSwitch={autoSwitch} />
                                        </div>
                                        <div className={clsx(tool !== 'move' && 'hidden')}>
                                            <ToolMove setTool={setTool} autoSwitch={autoSwitch} />
                                        </div>

                                        <DTImage skeleton />

                                        <KeyboardListener index={index} imageIds={imageIds} setTool={setTool} />
                                    </div>
                                ) : (
                                    <CircularProgress />
                                )}
                            </Grid>

                            <Grid item md={4} xs={12}>
                                <Box mb={2}>
                                    <Typography variant="overline" color="textPrimary">
                                        Original
                                    </Typography>

                                    {image && (
                                        <Box width="50%">
                                            {imageAugmented === null ? (
                                                <DTImage
                                                    className={clsx(classes.image, classes.selected)}
                                                    clickable
                                                    onClick={() => setImageAugmented(null)}
                                                    skeleton
                                                />
                                            ) : (
                                                <ImageProvider image={image}>
                                                    <DTImage
                                                        className={classes.image}
                                                        clickable
                                                        onClick={() => setImageAugmented(null)}
                                                        skeleton
                                                    />
                                                </ImageProvider>
                                            )}
                                        </Box>
                                    )}
                                </Box>

                                <Box mb={2}>
                                    <Typography variant="overline" color="textPrimary">
                                        Augmented
                                    </Typography>

                                    {image && (
                                        <ImagesProvider original_image_id={image_id}>
                                            <ImagesConsumer>
                                                {value => (
                                                    <>
                                                        {value.images instanceof Array && value.images.length > 0 && (
                                                            <Grid container spacing={1}>
                                                                {value.images.map(current => (
                                                                    <Grid
                                                                        key={current.id}
                                                                        item // @ts-ignore
                                                                        xs={Math.min(
                                                                            // @ts-ignore
                                                                            parseInt(12 / value.images.length),
                                                                            6
                                                                        )}
                                                                    >
                                                                        {imageAugmented !== null &&
                                                                        imageAugmented.id === current.id ? (
                                                                            <DTImage
                                                                                className={clsx(
                                                                                    classes.image,
                                                                                    classes.selected
                                                                                )}
                                                                                clickable
                                                                                onClick={() =>
                                                                                    setImageAugmented(current)
                                                                                }
                                                                                skeleton
                                                                            />
                                                                        ) : (
                                                                            <ImageProvider image={current}>
                                                                                <DTImage
                                                                                    className={classes.image}
                                                                                    clickable
                                                                                    onClick={() =>
                                                                                        setImageAugmented(current)
                                                                                    }
                                                                                    skeleton
                                                                                />
                                                                            </ImageProvider>
                                                                        )}
                                                                    </Grid>
                                                                ))}
                                                            </Grid>
                                                        )}
                                                        {value.images instanceof Array && value.images.length === 0 && (
                                                            <Typography
                                                                variant="caption"
                                                                component="p"
                                                                color="textSecondary"
                                                            >
                                                                No augmented images found.
                                                            </Typography>
                                                        )}
                                                        {value.images === null && (
                                                            <CircularProgress
                                                                className={classes.loader}
                                                                color="inherit"
                                                                disableShrink
                                                            />
                                                        )}
                                                    </>
                                                )}
                                            </ImagesConsumer>
                                        </ImagesProvider>
                                    )}
                                </Box>

                                <Divider sx={{my: 2}} />

                                <DTCategories />
                            </Grid>
                        </Grid>
                    </Container>
                </Scrollbar>
            </ImageProvider>
        </Dialog>
    );
};

export default DTLabelisator;
