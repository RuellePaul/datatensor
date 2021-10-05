import React, {FC} from 'react';
import clsx from 'clsx';
import {Grid, Stack} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';
import {SectionProps} from '../SectionProps';
import ImagesSlideshow from 'src/components/core/Images/ImagesSlideshow';
import ExportAction from './ExportAction';
import LabelisatorAction from './LabelisatorAction';
import EditAction from './EditAction';


const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}));

const SectionOverview: FC<SectionProps> = ({ className }) => {
    const classes = useStyles();

    return (
        <div className={clsx(classes.root, className)}>
            <Grid container spacing={4} justifyContent="space-between">

                <Grid item md={8} xs={12}>
                    <Stack spacing={4}>
                        <EditAction />

                        <LabelisatorAction />
                    </Stack>
                </Grid>

                <Grid item md={4} xs={12}>
                    <Stack spacing={4}>
                        <ImagesSlideshow />

                        <ExportAction />
                    </Stack>
                </Grid>

            </Grid>
        </div>
    );
};

export default SectionOverview;
