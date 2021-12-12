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
import CategoriesDistribution from 'src/components/charts/CategoriesDistribution';
import Scrollbar from 'src/components/utils/Scrollbar';
import KeyboardListener from './KeyboardListener';
import KeyboardShortcuts from './KeyboardShortcuts';
import NextUnlabeledImageAction from './NextUnlabeledImageAction';
import ToolLabel from './ToolLabel';
import ToolMove from './ToolMove';
import {Theme} from 'src/theme';
import useDataset from 'src/hooks/useDataset';
import useCategory from 'src/hooks/useCategory';
import usePipeline from 'src/hooks/usePipeline';
import {Image} from 'src/types/image';
import api from 'src/utils/api';
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
    }
}));

const Transition = forwardRef(function Transition(
    props: TransitionProps & {children?: React.ReactElement},
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const DTLabelisator: FC<DTLabelisatorProps> = () => {
    const classes = useStyles();

    const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

    const {dataset} = useDataset();
    const {pipeline} = usePipeline();
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

    const fetchImageIds = useCallback(async () => {
        setImageIds([]);
        try {
            const response = await api.get<{image_ids: string[]}>(`/datasets/${dataset.id}/images/ids`, {
                params: {
                    pipeline_id: pipeline?.id
                }
            });
            setImageIds(response.data.image_ids);
        } catch (err) {
            console.error(err);
        }
    }, [dataset.id, pipeline]);

    useEffect(() => {
        fetchImageIds();
    }, [fetchImageIds]);

    const image_id = window.location.hash.split('#')[1];

    const [image, setImage] = useState<Image>(null);

    const fetchImage = useCallback(async () => {
        if (!image_id) return;

        setImage(null);

        try {
            const response = await api.get<{image: Image}>(`/datasets/${dataset.id}/images/${image_id}`);
            setImage(response.data.image);
        } catch (err) {
            console.error(err);
        }
    }, [dataset.id, image_id]);

    const handleSliderChange = (event, value) => {
        try {
            goToHash(imageIds[value]);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchImage();
    }, [fetchImage]);

    const handleClose = () => {
        setOpen(false);
        saveCurrentCategory(null);
        window.location.replace(`#`);
    };

    const [open, setOpen] = useState<boolean>(window.location.hash.length > 0);

    useEffect(() => {
        const onHashChange = () => setOpen(window.location.hash.length > 0);
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
        >
            <ImageProvider image={image}>
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
                            <Grid item lg={8} xs={12}>
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
                                    />

                                    <NextUnlabeledImageAction index={index} pipeline_id={pipeline?.id} />
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
                                                        >
                                                            Save
                                                        </Button>
                                                    )}
                                                </ImageConsumer>
                                            }
                                        </span>
                                    </Tooltip>
                                </Box>

                                {image ? (
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

                            <Grid item lg={4} xs={12}>
                                <DTCategories />

                                <Hidden mdDown>
                                    <Box my={2}>
                                        <Divider />
                                    </Box>

                                    <Typography variant="overline" color="textPrimary">
                                        Top 10 categories
                                    </Typography>

                                    <CategoriesDistribution />
                                </Hidden>
                            </Grid>
                        </Grid>
                    </Container>
                </Scrollbar>
            </ImageProvider>
        </Dialog>
    );
};

export default DTLabelisator;
