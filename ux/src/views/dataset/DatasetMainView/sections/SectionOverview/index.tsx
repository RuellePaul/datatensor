import React, {FC} from 'react';
import clsx from 'clsx';
import {Grid, Stack} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';
import {SectionProps} from '../SectionProps';
import Categories from 'src/components/core/Dataset/Categories';
import ExportAction from './ExportAction';
import LabelisatorAction from './LabelisatorAction';
import UploadAction from './UploadAction';
import EditAction from './EditAction';
import Overview from './Overview';
import useImages from 'src/hooks/useImages';
import useDataset from 'src/hooks/useDataset';

const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}));

const SectionOverview: FC<SectionProps> = ({className}) => {
    const classes = useStyles();
    const {categories} = useDataset();
    const {images} = useImages();

    const totalLabelsCount = categories.map(category => category.labels_count || 0).reduce((acc, val) => acc + val, 0);

    return (
        <div className={clsx(classes.root, className)}>
            <Grid container spacing={2} justifyContent="space-between">
                <Grid item md={7} xs={12}>
                    <Stack spacing={3}>
                        <EditAction />
                        <Overview />
                        <Categories />
                    </Stack>
                </Grid>

                <Grid item md={4} xs={12}>
                    {(images === null || images.length === 0) && <UploadAction />}

                    {images !== null && images.length > 0 && totalLabelsCount === 0 && <LabelisatorAction />}

                    {images !== null && images.length > 0 && totalLabelsCount > 0 && <ExportAction />}
                </Grid>
            </Grid>
        </div>
    );
};

export default SectionOverview;
