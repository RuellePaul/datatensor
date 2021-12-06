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
import {Maximize as LabelIcon, Move as MoveIcon} from 'react-feather';
import {ImageConsumer} from 'src/store/ImageContext';


interface FeaturesProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2, 2, 0.5),
        background: theme.palette.background.paper,
        border: `solid 1px ${theme.palette.divider}`,
        borderRadius: 8
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
    overlay: {
        cursor: 'pointer',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.65)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: theme.spacing(2, 3),
        backdropFilter: 'blur(3px)'
    }
}));

const FeatureLabeling: FC<FeaturesProps> = ({ className, ...rest }) => {
    const classes = useStyles();

    const { images } = useImages();

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
            <Box display="flex" alignItems="center">
                <Hidden smDown>
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
                                        badgeContent={value.positions.length > 1 ? value.positions.length - 1 : 0}
                                        max={99}
                                    >
                                        <RestoreIcon />
                                    </Badge>
                                </Tooltip>
                            </IconButton>
                        </Box>
                    )}
                </ImageConsumer>
            </Box>

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
                            <Button onClick={handleCloseOverlay} sx={{ mt: 3 }}>
                                Got it
                            </Button>
                        </div>
                    </Hidden>
                )}
            </div>
        </div>
    );
};

export default FeatureLabeling;
