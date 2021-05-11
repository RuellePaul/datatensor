import React, {FC, useState} from 'react';
import clsx from 'clsx';
import useEventListener from 'use-typed-event-listener';
import {Box, Button, FormControlLabel, Grid, makeStyles, Switch, Tooltip, Typography} from '@material-ui/core';
import {Pagination, ToggleButton, ToggleButtonGroup} from '@material-ui/lab';
import {Maximize as LabelIcon, Move as MoveIcon} from 'react-feather';
import DTCategories from 'src/components/datatensor/Categories';
import DTImage from 'src/components/datatensor/Image';
import KeyboardShortcuts from 'src/components/overlays/KeyboardShortcuts';
import ToolLabel from './ToolLabel';
import ToolMove from './ToolMove';
import useImages from 'src/hooks/useImages';
import {Theme} from 'src/theme';
import {CANVAS_OFFSET} from 'src/utils/labeling';
import {ImageConsumer, ImageProvider} from 'src/contexts/ImageContext';

interface DTLabelisatorProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    container: {
        position: 'relative',
        margin: `${CANVAS_OFFSET}px auto`
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        margin: theme.spacing(2)
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        margin: theme.spacing(0, 0, 1)
    },
    divider: {
        borderLeft: `1px solid ${theme.palette.divider}`
    }
}));


const DTLabelisator: FC<DTLabelisatorProps> = ({
                                                   className,
                                                   ...rest
                                               }) => {
    const classes = useStyles();

    const {images} = useImages();
    const [selected, setSelected] = useState(0);

    const handleKeyDown = async (event: KeyboardEvent) => {
        if (event.key === 'a') {
            setTool('label')
        } else if (event.key === 'z') {
            setTool('move')
        } else if (event.key === 'ArrowLeft') {
            if (selected === 0) return;
            setSelected(selected - 1);
        } else if (event.key === 'ArrowRight') {
            if (selected === images.length - 1) return;
            setSelected(selected + 1);
        } else if (event.key === ' ') {
            setSelected(selected + 1);
        }
    };

    const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setSelected(value - 1);
    };


    const [tool, setTool] = useState<string>('label');
    const handleToolChange = (event: React.MouseEvent<HTMLElement>, newTool: string | null) => {
        if (newTool !== null)
            setTool(newTool);
    };

    const [autoSwitch, setAutoSwitch] = useState<boolean>(true);

    useEventListener(window, 'keydown', handleKeyDown);

    return (
        <Grid
            className={clsx(classes.root, className)}
            container
            spacing={4}
            {...rest}
        >
            <ImageProvider image={images[selected]}>
                <Grid item md={8} xs={12}>
                    <div className={classes.actions}>
                        <ToggleButtonGroup
                            value={tool}
                            exclusive
                            onChange={handleToolChange}
                            size="small"
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

                        <Box ml={2}>
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

                        <Tooltip
                            title={<Typography variant='overline'>
                                Reset (ESCAPE)
                            </Typography>}
                        >
                    <span>
                        <Button
                            size='small'
                        >
                            Reset
                        </Button>
                    </span>
                        </Tooltip>
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

                    <div
                        className={classes.container}
                        style={{maxWidth: 700 * images[selected].width / images[selected].height}}
                    >
                        {tool === 'label' && (
                            <ToolLabel
                                setTool={setTool}
                                autoSwitch={autoSwitch}
                            />
                        )}
                        {tool === 'move' && (
                            <ToolMove
                                setTool={setTool}
                                autoSwitch={autoSwitch}
                            />
                        )}
                        <DTImage/>
                    </div>

                    <Pagination
                        className={classes.pagination}
                        color='primary'
                        count={images.length}
                        page={selected + 1}
                        onChange={handlePaginationChange}
                    />
                </Grid>

                <Grid
                    className={classes.divider}
                    item
                    md={4}
                    xs={12}
                >
                    <KeyboardShortcuts/>

                    <Box mt={2}>
                        <DTCategories/>
                    </Box>
                </Grid>
            </ImageProvider>

        </Grid>
    );
};

export default DTLabelisator;
