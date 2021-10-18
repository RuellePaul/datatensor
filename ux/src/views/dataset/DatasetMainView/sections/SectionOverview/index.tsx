import React, {FC} from 'react';
import clsx from 'clsx';
import {Grid, Stack} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';
import {SectionProps} from '../SectionProps';
import Categories from 'src/components/core/Dataset/Categories';
import ImagesSlideshow from 'src/components/core/Images/ImagesSlideshow';
import ExportAction from './ExportAction';
import LabelisatorAction from './LabelisatorAction';
import UploadAction from './UploadAction';
import EditAction from './EditAction';
import Overview from './Overview';


const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}));

const SectionOverview: FC<SectionProps> = ({ className }) => {
    const classes = useStyles();

    return (
        <div className={clsx(classes.root, className)}>
            <Grid container spacing={5} justifyContent="space-between">
                <Grid item md={8} xs={12}>
                    <Stack spacing={3}>
                        <EditAction />
                        <Overview />
                        <ImagesSlideshow />
                        <Categories />
                    </Stack>
                </Grid>

                <Grid item md={4} xs={12}>
                    <Stack spacing={5}>
                        <UploadAction />

                        <LabelisatorAction />

                        <ExportAction />
                    </Stack>
                </Grid>
            </Grid>
        </div>
    );
};

export default SectionOverview;
