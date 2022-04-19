import React, {FC, useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import clsx from 'clsx';
import {
    Badge,
    Box,
    Button,
    FormControlLabel,
    Hidden,
    IconButton,
    Switch,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography,
    useMediaQuery
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';
import DTImage from 'src/components/core/Images/Image';
import ToolLabel from 'src/components/core/Labelisator/ToolLabel';
import ToolMove from 'src/components/core/Labelisator/ToolMove';
import {CANVAS_OFFSET} from 'src/utils/labeling';
import {MouseOutlined as MouseIcon, Restore as RestoreIcon} from '@mui/icons-material';
import KeyboardListener from 'src/components/core/Labelisator/KeyboardListener';
import useImages from 'src/hooks/useImages';
import useImage from 'src/hooks/useImage';
import {Maximize as LabelIcon, Move as MoveIcon} from 'react-feather';

interface FeatureProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        touchAction: 'pan-y',
        [theme.breakpoints.down('sm')]: {
            padding: '0px !important',
            border: 'none !important'
        },
        transform: 'rotateY(-35deg) rotateX(-15deg)',
        backfaceVisibility: 'hidden'
    },
    labelisator: {
        position: 'relative',
        margin: `${CANVAS_OFFSET}px 0px`
    },
    overlay: {
        cursor: 'pointer',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.65)',
        zIndex: 1025,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: theme.spacing(2, 3),
        backdropFilter: 'blur(3px)',
        color: 'white'
    }
}));

const FeatureLabeling: FC<FeatureProps> = ({className, ...rest}) => {
    const classes = useStyles();

    const {images} = useImages();
    const {positions, previousPosition} = useImage();

    const [tool, setTool] = useState<'label' | 'move'>('label');
    const handleToolChange = (event: React.MouseEvent<HTMLElement>, newTool: 'label' | 'move' | null) => {
        if (newTool !== null) setTool(newTool);
    };

    const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

    const [autoSwitch, setAutoSwitch] = useState<boolean>(isDesktop);

    useEffect(() => {
        setAutoSwitch(isDesktop);
        setTool('move');
    }, [isDesktop, setAutoSwitch]);

    const [openOverlay, setOpenOverlay] = useState<boolean>(!Boolean(Cookies.get('labelisatorTouchOverlay')));

    const handleCloseOverlay = () => {
        Cookies.set('labelisatorTouchOverlay', 'true');
        setOpenOverlay(false);
    };

    return (
        <div className={clsx(classes.root, className)} {...rest}>
            <Hidden smDown>
                <Box display="flex" alignItems="center">
                    <ToggleButtonGroup value={tool} exclusive onChange={handleToolChange} size="small">
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

                    <Box mr={1}>
                        <IconButton disabled={positions.length <= 1} onClick={previousPosition} size="large">
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
                                    badgeContent={positions.length > 1 ? positions.length - 1 : 0}
                                    max={99}
                                >
                                    <RestoreIcon />
                                </Badge>
                            </Tooltip>
                        </IconButton>
                    </Box>
                </Box>
            </Hidden>

            <div className={classes.labelisator}>
                <div className={clsx(tool !== 'label' && 'hidden')}>
                    <ToolLabel setTool={setTool} autoSwitch={autoSwitch} />
                </div>
                <div className={clsx(tool !== 'move' && 'hidden')}>
                    <ToolMove setTool={setTool} autoSwitch={autoSwitch} />
                </div>
                <KeyboardListener index={0} imageIds={images.map(image => image.id)} setTool={setTool} />

                <DTImage skeleton />

                {openOverlay && (
                    <Hidden smDown>
                        <div className={classes.overlay} onClick={handleCloseOverlay}>
                            <Box mb={2}>
                                <Typography variant="h6" color="textPrimary" align="center" gutterBottom>
                                    To start drawing labels, click and drag.
                                </Typography>
                                <Typography variant="h6" color="textPrimary" align="center" gutterBottom>
                                    To change a label, hover it or use right click.
                                </Typography>
                            </Box>
                            <MouseIcon className="highlight" fontSize="large" />
                            <Button color="inherit" variant="outlined" onClick={handleCloseOverlay} sx={{mt: 3}}>
                                Got it
                            </Button>
                        </div>
                    </Hidden>
                )}
            </div>

            <Hidden smUp>
                <Box display="flex" width="100%" justifyContent="flex-end">
                    <Button
                        color="inherit"
                        disabled={positions.length <= 1}
                        onClick={previousPosition}
                        size="small"
                        endIcon={
                            <Badge
                                color="primary"
                                badgeContent={positions.length > 1 ? positions.length - 1 : 0}
                                max={99}
                            >
                                <RestoreIcon />
                            </Badge>
                        }
                    >
                        Undo
                    </Button>
                </Box>
            </Hidden>
        </div>
    );
};

export default FeatureLabeling;
