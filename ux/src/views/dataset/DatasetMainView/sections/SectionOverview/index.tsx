import React, {FC} from 'react';
import clsx from 'clsx';
import {Box, Grid, makeStyles, Typography} from '@material-ui/core';
import {Theme} from 'src/theme';
import {SectionProps} from '../SectionProps';
import Categories from 'src/components/core/Dataset/Categories';
import LabelisatorAction from './LabelisatorAction';

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
            width: 68,
            backgroundColor: theme.palette.primary.main
        }
    }
}));


const SectionOverview: FC<SectionProps> = ({className}) => {

    const classes = useStyles();

    return (
        <div className={clsx(classes.root, className)}>
            <Box mb={3}>
                <Typography
                    className={classes.title}
                    variant="h4"
                    color="textPrimary"
                >
                    Dataset overview
                </Typography>
            </Box>

            <Grid
                container
                spacing={3}
            >
                <Grid
                    item
                    md={8}
                    xs={12}
                >
                    <Categories/>
                </Grid>
                <Grid
                    item
                    md={4}
                    xs={12}
                >
                    <LabelisatorAction/>
                </Grid>
            </Grid>
        </div>
    )
};

export default SectionOverview;
