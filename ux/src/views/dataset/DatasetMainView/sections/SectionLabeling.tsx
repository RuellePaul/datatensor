import React, {FC, useEffect, useState} from 'react';
import {
    Box,
    Button,
    FormControlLabel,
    Grid,
    IconButton,
    makeStyles,
    Switch,
    Tooltip,
    Typography
} from '@material-ui/core';
import {Restore as RestoreIcon} from '@material-ui/icons';
import {Pagination, ToggleButton, ToggleButtonGroup} from '@material-ui/lab';
import {Maximize as LabelIcon, Move as MoveIcon} from 'react-feather';
import DTLabelisator from 'src/components/datatensor/Labelisator';
import {CategoryProvider} from 'src/store/CategoryContext';
import {ImageConsumer, ImageProvider} from 'src/store/ImageContext';
import KeyboardShortcuts from 'src/components/overlays/KeyboardShortcuts';
import DTCategories from 'src/components/datatensor/Categories';
import {Theme} from 'src/theme';
import useImages from 'src/hooks/useImages';
import {LAZY_LOAD_BATCH} from 'src/constants';
import clsx from 'clsx';
import {SectionProps} from './SectionProps';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        marginTop: theme.spacing(3)
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
        borderLeft: `dashed 1px ${theme.palette.divider}`
    }
}));

const SectionLabeling: FC<SectionProps> = ({className}) => {

    const classes = useStyles();

    const {images, saveOffset} = useImages();

    const [selected, setSelected] = useState(0);

    const [tool, setTool] = useState<'label' | 'move'>('label');
    const handleToolChange = (event: React.MouseEvent<HTMLElement>, newTool: 'label' | 'move' | null) => {
        if (newTool !== null)
            setTool(newTool);
    };
    const [autoSwitch, setAutoSwitch] = useState<boolean>(true);

    const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setSelected(value - 1);
    };

    useEffect(() => {
        if (selected === images.length - 1)
            saveOffset(offset => offset + LAZY_LOAD_BATCH);

        // eslint-disable-next-line
    }, [selected])

    if (!images[selected])
        return null;

    return (
        <div className={clsx(classes.root, className)}>
            <ImageProvider image={images[selected]}>
                <CategoryProvider>
                    <Grid
                        container
                        spacing={4}
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

                                <ImageConsumer>
                                    {
                                        value => (
                                            <IconButton
                                                disabled={value.positions.length <= 1}
                                                onClick={value.previousPosition}
                                            >
                                                <RestoreIcon/>
                                            </IconButton>
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
                </CategoryProvider>
            </ImageProvider>
        </div>
    )
};

export default SectionLabeling;
