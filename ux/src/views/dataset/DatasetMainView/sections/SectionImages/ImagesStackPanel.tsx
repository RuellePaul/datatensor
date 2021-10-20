import React, {FC} from 'react';
import {Box, Button, ButtonGroup} from '@mui/material';
import {makeStyles} from '@mui/styles';
import DTImagesList from 'src/components/core/Images/ImagesList';
import FancyLabel from 'src/components/FancyLabel';
import useDataset from 'src/hooks/useDataset';
import {Theme} from 'src/theme';
import useCategory from 'src/hooks/useCategory';
import useImages from 'src/hooks/useImages';
import usePipeline from 'src/hooks/usePipeline';
import FilterCategories from './FilterCategories';
import {ImagesProvider} from 'src/store/ImagesContext';
import {Pipeline} from 'src/types/pipeline';

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    sticky: {
        position: 'sticky',
        top: 49,
        zIndex: 1100,
        background: theme.palette.background.default,

        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(2, 0)
    }
}));

interface ImagesStackPanelProps {
    pipeline?: Pipeline;
}

interface DTImagesWrapperProps {
    pipeline_id?: string;
}

const DTImagesWrapper: FC<DTImagesWrapperProps> = ({pipeline_id}) => {
    const classes = useStyles();

    const {dataset, pipelines} = useDataset();
    const {pipeline, savePipeline} = usePipeline();
    const {totalImagesCount} = useImages();
    const {currentCategory} = useCategory();

    return (
        <>
            <div className={classes.sticky}>
                <FilterCategories />

                {currentCategory !== null && totalImagesCount > 0 && (
                    <Box ml={2}>
                        <FancyLabel>{totalImagesCount} images found</FancyLabel>
                    </Box>
                )}

                <Box flexGrow={1} />

                <ButtonGroup size="small">
                    <Button onClick={() => savePipeline(null)} variant={pipeline === null ? 'contained' : 'outlined'}>
                        Original ({dataset.image_count})
                    </Button>
                    {pipelines.map(current => (
                        <Button
                            key={current.id}
                            onClick={() => savePipeline(current)}
                            variant={pipeline?.id === current.id ? 'contained' : 'outlined'}
                        >
                            Augmented ({current.image_count})
                        </Button>
                    ))}
                </ButtonGroup>
            </div>

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
