import React, {FC, useRef, useState} from 'react';
import clsx from 'clsx';
import {Box, Button, Grid, ListItemText, makeStyles, Menu, MenuItem, Typography} from '@material-ui/core';
import {Pagination} from '@material-ui/lab';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {Theme} from 'src/theme';
import DTDataset from 'src/components/datatensor/Dataset';
import useDatasets from 'src/hooks/useDatasets';
import useTasks from 'src/hooks/useTasks';

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

    const {tasks} = useTasks();
    const {datasets} = useDatasets();

    const sortRef = useRef<HTMLButtonElement | null>(null);
    const [openSort, setOpenSort] = useState<boolean>(false);
    const [selectedSort, setSelectedSort] = useState<string>('Most recent');


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


    return (
        <div
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
                mb={2}
            >
                <Typography
                    className={classes.title}
                    variant="h5"
                    color="textPrimary"
                >
                    Showing
                    {' '}
                    {datasets.length}
                    {' '}
                    datasets
                </Typography>
                <Box
                    display="flex"
                    alignItems="center"
                >
                    <Button
                        className={classes.sortButton}
                        onClick={handleSortOpen}
                        ref={sortRef}
                    >
                        {selectedSort}
                        <ArrowDropDownIcon/>
                    </Button>
                </Box>
            </Box>
            <Grid
                container
                spacing={3}
            >
                {datasets.map((dataset) => (
                    <Grid
                        item
                        key={dataset._id}
                        md={4}
                        sm={6}
                        xs={12}
                    >
                        <DTDataset
                            dataset={dataset}
                            isWorking={tasks.filter(task => task.status === 'active' && task.dataset_id === dataset._id).length > 0}
                        />
                    </Grid>
                ))}
            </Grid>
            <Box
                mt={6}
                display="flex"
                justifyContent="center"
            >
                <Pagination count={1}/>
            </Box>
            <Menu
                anchorEl={sortRef.current}
                onClose={handleSortClose}
                open={openSort}
                elevation={1}
            >
                {['Most recent', 'Best mAP'].map(
                    (option) => (
                        <MenuItem
                            key={option}
                            onClick={() => handleSortSelect(option)}
                        >
                            <ListItemText primary={option}/>
                        </MenuItem>
                    )
                )}
            </Menu>
        </div>
    );
};

export default Results;
