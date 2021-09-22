import React, {FC} from 'react';
import clsx from 'clsx';
import {Box, makeStyles, Typography} from '@material-ui/core';
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
            <Box mb={2}>
                <Typography
                    className={classes.title}
                    variant="h3"
                    color="textPrimary"
                >
                    Dataset overview
                </Typography>
            </Box>

            <LabelisatorAction/>

            <Categories/>
        </div>
    )
};

export default SectionOverview;
