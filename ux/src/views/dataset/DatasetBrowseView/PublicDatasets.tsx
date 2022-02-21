import React, {FC, useRef, useState} from 'react';
import clsx from 'clsx';
import {
    Box,
    Button,
    ClickAwayListener,
    Grid,
    IconButton,
    ListItemText,
    Menu,
    MenuItem,
    Pagination,
    Tooltip,
    Typography
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {ArrowDropDown, HelpOutline as HelpIcon} from '@mui/icons-material';
import {Theme} from 'src/theme';
import DTDataset from 'src/components/core/Dataset';
import useDatasets from 'src/hooks/useDatasets';
import {DatasetProvider} from 'src/store/DatasetContext';
import {MAX_DATASETS_DISPLAYED} from 'src/config';

interface ResultsProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        paddingBottom: theme.spacing(4)
    },
    title: {
        position: 'relative',
        '&:after': {
            position: 'absolute',
            bottom: -8,
            left: 0,
            content: '" "',
            height: 3,
            width: 64,
            backgroundColor: theme.palette.primary.main
        }
    },
    sortButton: {
        textTransform: 'none',
        letterSpacing: 0
    }
}));

const PublicDatasets: FC<ResultsProps> = ({className, ...rest}) => {
    const classes = useStyles();

    const {displayedDatasets} = useDatasets();

    const [open, setOpen] = React.useState(false);
    const handleTooltipClose = () => {
        setOpen(false);
    };
    const handleTooltipOpen = () => {
        setOpen(true);
    };

    const sortRef = useRef<HTMLButtonElement | null>(null);
    const [openSort, setOpenSort] = useState<boolean>(false);
    const [selectedSort, setSelectedSort] = useState<string>('Most images');

    const handleSortOpen = (): void => {
        setOpenSort(true);
    };

    const handleSortClose = (): void => {
        setOpenSort(false);
    };

    const handleSortSelect = (value: string): void => {
        setSelectedSort(value);
        setOpenSort(false);
    };

    const [page, setPage] = useState<number>(0);

    const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value - 1);
    };

    if (displayedDatasets === null || displayedDatasets.length === 0) return null;

    return (
        <div className={clsx(classes.root, className)} {...rest}>
            <Box display="flex" alignItems="center" flexWrap="wrap" mb={2}>
                <Typography className={classes.title} variant="h5" color="textPrimary">
                    {displayedDatasets.length}{' '}
                    <Typography variant="h5" component="span" color="primary">
                        public dataset{displayedDatasets.length > 1 ? 's' : ''}
                    </Typography>
                </Typography>
                <ClickAwayListener onClickAway={handleTooltipClose}>
                    <div>
                        <Tooltip
                            PopperProps={{
                                disablePortal: true
                            }}
                            onClose={handleTooltipClose}
                            open={open}
                            disableFocusListener
                            disableHoverListener
                            disableTouchListener
                            title="A public dataset is made by another user, but can be exported by anyone."
                        >
                            <sup>
                                <IconButton onClick={handleTooltipOpen}>
                                    <HelpIcon fontSize="small" />
                                </IconButton>
                            </sup>
                        </Tooltip>
                    </div>
                </ClickAwayListener>

                <Box flexGrow={1} />

                <Box display="flex" alignItems="center">
                    <Button className={classes.sortButton} onClick={handleSortOpen} ref={sortRef}>
                        {selectedSort}
                        <ArrowDropDown />
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {displayedDatasets
                    .sort((a, b) => {
                        if (selectedSort === 'Most images')
                            return (
                                b.image_count + (b.augmented_count || 0) - (a.image_count + (a.augmented_count || 0))
                            );
                        else if (selectedSort === 'Most recent')
                            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                        else return 0;
                    })
                    .slice(page * MAX_DATASETS_DISPLAYED, page * MAX_DATASETS_DISPLAYED + MAX_DATASETS_DISPLAYED)
                    .map(dataset => (
                        <Grid
                            item
                            key={dataset.id}
                            md={4}
                            sm={6}
                            xs={12}
                            sx={{display: 'flex', justifyContent: 'center', height: '100%'}}
                        >
                            <DatasetProvider dataset={dataset} categories={dataset.categories}>
                                <DTDataset />
                            </DatasetProvider>
                        </Grid>
                    ))}
            </Grid>
            {displayedDatasets.length > MAX_DATASETS_DISPLAYED && (
                <Box mt={6} display="flex" justifyContent="center">
                    <Pagination
                        color="primary"
                        count={Math.ceil(displayedDatasets.length / MAX_DATASETS_DISPLAYED)}
                        page={page + 1}
                        onChange={handlePaginationChange}
                    />
                </Box>
            )}
            <Menu anchorEl={sortRef.current} onClose={handleSortClose} open={openSort} elevation={1}>
                {['Most images', 'Most recent'].map(option => (
                    <MenuItem key={option} onClick={() => handleSortSelect(option)}>
                        <ListItemText primary={option} />
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
};

export default PublicDatasets;
