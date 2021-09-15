import React, {FC, forwardRef, useCallback, useEffect, useState} from 'react';
import clsx from 'clsx';
import {Maximize as LabelIcon, Move as MoveIcon} from 'react-feather';
import {
    AppBar,
    Button,
    Dialog,
    FormControlLabel,
    IconButton,
    makeStyles,
    Slide,
    Switch,
    Toolbar,
    Tooltip,
    Typography
} from '@material-ui/core';
import {ToggleButton, ToggleButtonGroup} from '@material-ui/lab';
import {TransitionProps} from '@material-ui/core/transitions';
import {Close as CloseIcon, Restore as RestoreIcon} from '@material-ui/icons';
import DTImage from 'src/components/core/Images/Image';
import DTCategories from 'src/components/core/Categories';
import ToolLabel from './ToolLabel';
import ToolMove from './ToolMove';
import {Theme} from 'src/theme';
import useDataset from 'src/hooks/useDataset';
import {Image} from 'src/types/image';
import api from 'src/utils/api';
import {ImageConsumer, ImageProvider} from 'src/store/ImageContext';

interface DTLabelisatorProps {
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    header: {
        position: 'relative'
    },
    toolbar: {
        justifyContent: 'space-between'
    },
    wrapper: {
        position: 'relative'
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

    const index = window.location.hash.split('#')[1];

    const [image, setImage] = useState<Image>(null);

    const fetchImage = useCallback(async () => {
        try {
            const response = await api.get<{ images: Image[] }>(`/datasets/${dataset.id}/images/`, {
                params: {
                    offset: index,
                    limit: 1
                }
            });
            setImage(response.data.images[0]);
        } catch (err) {
            console.error(err);
        }

    }, [dataset.id, index]);

    useEffect(() => {
        fetchImage()
    }, [fetchImage]);

    const handleClose = () => {
        window.location.hash = '';
    }

    const [open, setOpen] = useState<boolean>(window.location.hash.length > 0);

    useEffect(() => {
        const onHashChange = () => setOpen(window.location.hash.length > 0);
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);

        // eslint-disable-next-line
    }, []);

    if (!image)
        return null;

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <AppBar
                className={classes.header}
            >
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge='start'
                        color='inherit'
                        onClick={handleClose}
                    >
                        <CloseIcon/>
                    </IconButton>

                    <Button color='inherit' onClick={handleClose}>
                        Save
                    </Button>
                </Toolbar>
            </AppBar>

            <ImageProvider image={image}>
                <div>
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

                <div className={classes.wrapper}>
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

                    <DTImage skeleton/>

                    <DTCategories/>
                </div>
            </ImageProvider>
        </Dialog>
    );
};

export default DTLabelisator;
