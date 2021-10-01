import React, {FC} from 'react';
import clsx from 'clsx';
import {Grid, makeStyles} from '@material-ui/core';
import {Theme} from 'src/theme';
import {SectionProps} from '../SectionProps';
import ImagesSlideshow from 'src/components/core/Images/ImagesSlideshow';
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
                spacing={4}
                justifyContent='space-between'
            >
                <Grid
                    item
                    md={8}
                    xs={12}
                >
                    <LabelisatorAction/>
                </Grid>
                <Grid
                    item
                    md={4}
                    xs={12}
                >
                    <ImagesSlideshow/>
                </Grid>
            </Grid>
        </div>
    )
};

export default SectionOverview;
