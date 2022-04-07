import React, {FC, useState} from 'react';
import clsx from 'clsx';
import {Box, Divider, Grid, Pagination, Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';
import DTDataset from 'src/components/core/Dataset';
import useAuth from 'src/hooks/useAuth';
import useDatasets from 'src/hooks/useDatasets';
import {DatasetProvider} from 'src/store/DatasetContext';
import {MAX_DATASETS_DISPLAYED} from 'src/config';

interface ResultsProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(4, 0, 0)
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
    }
}));

const OwnDatasets: FC<ResultsProps> = ({className, ...rest}) => {
    const classes = useStyles();

    const {user} = useAuth();

    const {datasets} = useDatasets();

    const [page, setPage] = useState<number>(0);

    const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value - 1);
    };

    const ownDatasets = datasets.filter(dataset => dataset.user_id === user.id);

    if (ownDatasets.length === 0) return null;

    return (
        <div className={clsx(classes.root, className)} {...rest}>
            <Box display="flex" alignItems="center" flexWrap="wrap" mb={4}>
                <Typography className={classes.title} variant="h5" color="textPrimary">
                    Your datasets
                </Typography>
            </Box>

            <Grid container columnSpacing={2} rowSpacing={3}>
                {ownDatasets
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
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
            {ownDatasets.length > MAX_DATASETS_DISPLAYED && (
                <Box mt={6} display="flex" justifyContent="center">
                    <Pagination
                        color="primary"
                        count={Math.ceil(ownDatasets.length / MAX_DATASETS_DISPLAYED)}
                        page={page + 1}
                        onChange={handlePaginationChange}
                    />
                </Box>
            )}
            <Divider sx={{width: '100%', mt: 6}} >
                <Typography variant="overline" color="primary">Public datasets</Typography>
            </Divider>
        </div>
    );
};

export default OwnDatasets;
