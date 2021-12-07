import React, {FC, useRef, useState} from 'react';
import clsx from 'clsx';
import {Box, Button, Grid, ListItemText, Menu, MenuItem, Pagination, Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {Theme} from 'src/theme';
import DTDataset from 'src/components/core/Dataset';
import useDatasets from 'src/hooks/useDatasets';
import {MAX_DATASETS_DISPLAYED} from 'src/config';
import {DatasetProvider} from '../../../store/DatasetContext';

interface ResultsProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    title: {
        position: 'relative',
        '&:after': {
            position: 'absolute',
            bottom: -8,
            left: 0,
            content: '" "',
            height: 3,
            width: 48,
            backgroundColor: theme.palette.primary.main
        }
    },
    sortButton: {
        textTransform: 'none',
        letterSpacing: 0,
        marginRight: theme.spacing(2)
    }
}));

const Results: FC<ResultsProps> = ({className, ...rest}) => {
    const classes = useStyles();

    const {displayedDatasets} = useDatasets();

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

    return (
        <div className={clsx(classes.root, className)} {...rest}>
            <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" mb={2}>
                <Typography className={classes.title} variant="h5" color="textPrimary">
                    Showing {displayedDatasets.length} dataset
                    {displayedDatasets.length > 1 ? 's' : ''}
                </Typography>
                <Box display="flex" alignItems="center">
                    <Button className={classes.sortButton} onClick={handleSortOpen} ref={sortRef}>
                        {selectedSort}
                        <ArrowDropDownIcon />
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
                        else if (selectedSort === 'Most original images') return b.image_count - a.image_count;
                        else if (selectedSort === 'Most recent')
                            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                        else return 0;
                    })
                    .slice(page * MAX_DATASETS_DISPLAYED, page * MAX_DATASETS_DISPLAYED + MAX_DATASETS_DISPLAYED)
                    .map(dataset => (
                        <Grid item key={dataset.id} md={4} sm={6} xs={12}>
                            <DatasetProvider dataset={dataset} categories={dataset.categories}>
                                <DTDataset dataset={dataset} />
                            </DatasetProvider>
                        </Grid>
                    ))}
            </Grid>
            <Box mt={6} display="flex" justifyContent="center">
                <Pagination
                    color="primary"
                    count={Math.ceil(displayedDatasets.length / MAX_DATASETS_DISPLAYED)}
                    page={page + 1}
                    onChange={handlePaginationChange}
                />
            </Box>
            <Menu anchorEl={sortRef.current} onClose={handleSortClose} open={openSort} elevation={1}>
                {['Most images', 'Most original images', 'Most recent'].map(option => (
                    <MenuItem key={option} onClick={() => handleSortSelect(option)}>
                        <ListItemText primary={option} />
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
};

export default Results;
