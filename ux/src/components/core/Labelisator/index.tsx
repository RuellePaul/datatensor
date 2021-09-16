import React, {FC, forwardRef, useCallback, useEffect, useState} from 'react';
import clsx from 'clsx';
import {Maximize as LabelIcon, Move as MoveIcon} from 'react-feather';
import {
    AppBar,
    Box,
    Button,
    CircularProgress,
    Container,
    Dialog,
    FormControlLabel,
    Grid,
    IconButton,
    makeStyles,
    Slide,
    Slider,
    Switch,
    Toolbar,
    Tooltip,
    Typography
} from '@material-ui/core';
import {ToggleButton, ToggleButtonGroup} from '@material-ui/lab';
import {TransitionProps} from '@material-ui/core/transitions';
import {Close as CloseIcon, Restore as RestoreIcon} from '@material-ui/icons';
import DTCategories from 'src/components/core/Categories';
import DTImage from 'src/components/core/Images/Image';
import KeyboardListener from './KeyboardListener';
import KeyboardShortcuts from './KeyboardShortcuts';
import ToolLabel from './ToolLabel';
import ToolMove from './ToolMove';
import {Theme} from 'src/theme';
import useDataset from 'src/hooks/useDataset';
import {Image} from 'src/types/image';
import api from 'src/utils/api';
import {ImageConsumer, ImageProvider} from 'src/store/ImageContext';
import {CANVAS_OFFSET} from 'src/utils/labeling';

interface DTLabelisatorProps {
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    paper: {
        overflowX: 'hidden'
    },
    content: {
        padding: theme.spacing(2, 0)
    },
    header: {
        position: 'relative'
    },
    toolbar: {
        alignItems: 'center'
    },
    switch: {
        marginLeft: theme.spacing(2)
    }
}));

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction='up' ref={ref} {...props} />;
});


const DTLabelisator: FC<DTLabelisatorProps> = () => {
    const classes = useStyles();

    const {dataset} = useDataset();

    const [autoSwitch, setAutoSwitch] = useState<boolean>(true);

    const [tool, setTool] = useState<'label' | 'move'>('label');
    const handleToolChange = (event: React.MouseEvent<HTMLElement>, newTool: 'label' | 'move' | null) => {
        if (newTool !== null)
            setTool(newTool);
    };

    const [imageIds, setImageIds] = useState<string[]>([]);

    const fetchImageIds = useCallback(async () => {
        setImageIds([]);
        try {
            const response = await api.get<{ image_ids: string[] }>(`/datasets/${dataset.id}/images/ids`);
            setImageIds(response.data.image_ids);
        } catch (err) {
            console.error(err);
        }

    }, [dataset.id]);

    useEffect(() => {
        fetchImageIds()
    }, [fetchImageIds])

    const image_id = window.location.hash.split('#')[1];

    const [image, setImage] = useState<Image>(null);

    const fetchImage = useCallback(async () => {
        setImage(null);
        try {
            const response = await api.get<{ image: Image }>(`/datasets/${dataset.id}/images/${image_id}`);
            setImage(response.data.image);
        } catch (err) {
            console.error(err);
        }

    }, [dataset.id, image_id]);

    const handleSliderChange = (event, value) => {
        try {
            window.location.hash = imageIds[value]
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchImage()
    }, [fetchImage]);

    const handleClose = () => {
        setOpen(false);
        window.location.hash = '';
    }

    const [open, setOpen] = useState<boolean>(window.location.hash.length > 0);

    useEffect(() => {
        const onHashChange = () => setOpen(window.location.hash.length > 0);
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);

        // eslint-disable-next-line
    }, []);

    const [index, setIndex] = useState<number>(0);
    useEffect(() => {
        setIndex(imageIds.indexOf(image_id))
    }, [imageIds, image_id])

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
                <AppBar
                    className={classes.header}
                >
                    <Toolbar className={classes.toolbar}>
                        <Typography
                            variant='h4'
                            color='textPrimary'
                        >
                            Labelisator
                        </Typography>
                        <Box flexGrow={1}/>
                        <Box mr={2}>
                            <KeyboardShortcuts/>
                        </Box>
                        <IconButton
                            edge='start'
                            color='inherit'
                            onClick={handleClose}
                        >
                            <CloseIcon/>
                        </IconButton>
                    </Toolbar>
                </AppBar>

                <Container
                    maxWidth='lg'
                >
                    <Grid
                        className={classes.content}
                        container
                        spacing={2}
                    >
                        <Grid
                            item
                            xs={12}
                        >
                            <Typography
                                variant='overline'
                                color='textSecondary'
                            >
                                Image {imageIds.indexOf(image_id) + 1} / {imageIds.length}
                            </Typography>

                            <Slider
                                min={0}
                                max={imageIds.length - 1}
                                valueLabelDisplay='auto'
                                defaultValue={imageIds.indexOf(image_id)}
                                onClick={event => event.stopPropagation()}
                                onChangeCommitted={handleSliderChange}
                                valueLabelFormat={x => x + 1}
                                value={index}
                                onChange={(event, value) => setIndex(value as number)}
                            />
                        </Grid>
                        <Grid
                            item
                            md={8}
                            xs={12}
                        >
                            <Box
                                display='flex'
                                alignItems='center'
                            >
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
                                                Draw (a)
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
                                                Move (z)
                                            </Typography>}
                                        >
                                            <MoveIcon/>
                                        </Tooltip>
                                    </ToggleButton>
                                </ToggleButtonGroup>

                                <FormControlLabel
                                    className={classes.switch}
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
                            </Box>

                            {image
                                ? (
                                    <Box
                                        position='relative'
                                        my={`${CANVAS_OFFSET}px`}
                                    >
                                        <div className={clsx(tool !== 'label' && 'hidden')}>
                                            <ToolLabel
                                                setTool={setTool}
                                                autoSwitch={autoSwitch}
                                            />
                                        </div>
                                        <div className={clsx(tool !== 'move' && 'hidden')}>
                                            <ToolMove
                                                setTool={setTool}
                                                autoSwitch={autoSwitch}
                                            />
                                        </div>

                                        <DTImage
                                            skeleton
                                            fullWidth
                                        />

                                        <KeyboardListener
                                            index={index}
                                            imageIds={imageIds}
                                            setTool={setTool}
                                        />
                                    </Box>
                                )
                                : <CircularProgress/>
                            }
                        </Grid>

                        <Grid
                            item
                            md={4}
                            xs={12}
                        >
                            <DTCategories/>
                        </Grid>
                    </Grid>
                </Container>
            </ImageProvider>
        </Dialog>
    );
};

export default DTLabelisator;
