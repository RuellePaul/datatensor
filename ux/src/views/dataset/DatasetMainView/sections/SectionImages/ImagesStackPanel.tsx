import React, {FC} from 'react';
import {Box, Typography} from '@mui/material';
import {makeStyles} from '@mui/styles';
import DTImagesList from 'src/components/core/Images/ImagesList';
import useDataset from 'src/hooks/useDataset';
import {Theme} from 'src/theme';
import useCategory from 'src/hooks/useCategory';
import useImages from 'src/hooks/useImages';
import FilterCategories from './FilterCategories';
import {ImagesProvider} from 'src/store/ImagesContext';
import {Pipeline} from 'src/types/pipeline';

const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}));

interface ImagesStackPanelProps {
    pipeline?: Pipeline;
}

interface DTImagesWrapperProps {
    pipeline_id?: string;
}

const DTImagesWrapper: FC<DTImagesWrapperProps> = ({pipeline_id}) => {
    const {images, totalImagesCount} = useImages();
    const {currentCategory} = useCategory();

    const {dataset, pipelines} = useDataset();

    return (
        <>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <FilterCategories />

                <Typography variant="body2" color="textPrimary">
                    {images.length} /{' '}
                    {currentCategory
                        ? totalImagesCount
                        : pipeline_id
                        ? pipelines.find(pipeline => pipeline.id === pipeline_id).image_count
                        : dataset.image_count}
                </Typography>
            </Box>
            <DTImagesList pipeline_id={pipeline_id} />
        </>
    );
};

const ImagesStackPanel: FC<ImagesStackPanelProps> = ({pipeline = {}}) => {
    const classes = useStyles();
    const {currentCategory} = useCategory();

    return (
        <div className={classes.root}>
            {currentCategory === null ? (
                <DTImagesWrapper pipeline_id={pipeline.id} />
            ) : (
                <ImagesProvider category_id={currentCategory.id} pipeline_id={pipeline.id}>
                    <DTImagesWrapper pipeline_id={pipeline.id} />
                </ImagesProvider>
            )}
        </div>
    );
};

export default ImagesStackPanel;
