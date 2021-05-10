import React, {FC, useEffect, useState} from 'react';
import clsx from 'clsx';
import {useSnackbar} from 'notistack';
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
import {Label} from 'src/types/label';
import {Image} from 'src/types/image';
import api from 'src/utils/api';
import {Theme} from 'src/theme';
import {CANVAS_OFFSET, checkLabelsEquality} from 'src/utils/labeling';

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
    const {enqueueSnackbar} = useSnackbar();

    const {images, saveImages} = useImages();
    const [selected, setSelected] = useState(0);

    const [labels, setLabels] = useState<Label[]>(images[selected].labels || []);

    const labelsChanged: boolean = !checkLabelsEquality(labels, images[selected].labels);

    const saveLabels = async (labels: Label[]) => {
        if (labelsChanged) {
            const response = await api.post<Image>(`/v1/images/labeling/${images[selected]._id}`, {labels});
            enqueueSnackbar('Labels updated', {variant: 'info'});
            saveImages(
                images.map(image => image._id === response.data._id
                    ? {
                        ...image,
                        labels: response.data.labels
                    }
                    : image
                )
            );
        }
    };

    useEffect(() => {
        setLabels(images[selected].labels);
    }, [images, selected]);

    const handleKeyDown = async (event: KeyboardEvent) => {
        if (event.key === 'a') {
            setTool('label')
        } else if (event.key === 'z') {
            if (labels.length === 0) return;
            setTool('move')
        } else if (event.key === 'ArrowLeft') {
            if (selected === 0) return;
            setSelected(selected - 1);
        } else if (event.key === 'ArrowRight') {
            if (selected === images.length - 1) return;
            setSelected(selected + 1);
        } else if (event.key === ' ') {
            await saveLabels(labels);
            if (selected === images.length - 1) return;
            setSelected(selected + 1);
        } else if (event.key === 'Escape') {
            setLabels(images[selected].labels)
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
                            disabled={autoSwitch || labels.length === 0}
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
                            onClick={() => setLabels(images[selected].labels)}
                            disabled={!labelsChanged}
                            size='small'
                        >
                            Reset
                        </Button>
                    </span>
                    </Tooltip>
                    <Tooltip
                        title={<Typography variant='overline'>
                            Save (SPACE)
                        </Typography>}
                    >
                    <span>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => saveLabels(labels)}
                            disabled={!labelsChanged}
                            size='small'
                        >
                            Save
                        </Button>
                    </span>
                    </Tooltip>
                </div>

                <div
                    className={classes.container}
                    style={{maxWidth: 700 * images[selected].width / images[selected].height}}
                >
                    {tool === 'label' && (
                        <ToolLabel
                            labels={labels}
                            setLabels={setLabels}
                            setTool={setTool}
                            autoSwitch={autoSwitch}
                        />
                    )}
                    {tool === 'move' && (
                        <ToolMove
                            labels={labels}
                            setLabels={setLabels}
                            setTool={setTool}
                            autoSwitch={autoSwitch}
                        />
                    )}
                    <DTImage
                        image={images[selected]}
                        labels={labels}
                    />
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

        </Grid>
    );
};

export default DTLabelisator;
