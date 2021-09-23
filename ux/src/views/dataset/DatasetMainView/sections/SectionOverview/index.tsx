import React, {FC} from 'react';
import clsx from 'clsx';
import {Grid, makeStyles} from '@material-ui/core';
import {Theme} from 'src/theme';
import {SectionProps} from '../SectionProps';
import Categories from 'src/components/core/Dataset/Categories';
import LabelisatorAction from './LabelisatorAction';

const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}));


const SectionOverview: FC<SectionProps> = ({className}) => {

    const classes = useStyles();

    return (
        <div className={clsx(classes.root, className)}>
            <Grid
                container
                spacing={3}
            >
                <Grid
                    item
                    md={5}
                    xs={12}
                >
                    <LabelisatorAction/>
                </Grid>
                <Grid
                    item
                    md={7}
                    xs={12}
                >
                    <Categories/>
                </Grid>
            </Grid>
        </div>
    )
};

export default SectionOverview;
