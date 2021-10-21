import React, {FC} from 'react';
import {Box, Button, ButtonGroup, Paper} from '@mui/material';
import {makeStyles} from '@mui/styles';
import DTImagesList from 'src/components/core/Images/ImagesList';
import UploadButton from 'src/components/core/Images/UploadButton';
import useDataset from 'src/hooks/useDataset';
import {Theme} from 'src/theme';
import useCategory from 'src/hooks/useCategory';
import useImages from 'src/hooks/useImages';
import usePipeline from 'src/hooks/usePipeline';
import FilterCategories from './FilterCategories';

import {ImagesProvider} from 'src/store/ImagesContext';
import {Pipeline} from 'src/types/pipeline';
import {LAZY_LOAD_BATCH} from 'src/constants';
import DeletePipelineAction from './DeletePipelineAction';
import ViewPipelineAction from './ViewPipelineAction';


const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    sticky: {
        position: 'sticky',
        top: 49,
        zIndex: 1100,
        background: theme.palette.background.default,
        display: 'flex',
        alignItems: 'flex-start',
        padding: theme.spacing(2, 0),
        [theme.breakpoints.down('md')]: {
            position: 'relative',
            top: 0,
            zIndex: 1000,
            flexDirection: 'column-reverse',
            alignItems: 'flex-start'
        }
    }
}));

interface ImagesStackPanelProps {
    pipeline?: Pipeline;
}

interface DTImagesWrapperProps {
    pipeline_id?: string;
}

const Navigation: FC = () => {
    const { dataset, pipelines } = useDataset();
    const { pipeline } = usePipeline();
    const { images, offset, saveOffset, totalImagesCount } = useImages();
    const { currentCategory } = useCategory();

    const imagesCount = currentCategory
        ? totalImagesCount
        : pipeline?.id
            ? pipelines.find(current => current.id === pipeline.id).image_count
            : dataset.image_count;

    const handlePrevious = () => {
        saveOffset(offset => offset - LAZY_LOAD_BATCH);
    };

    const handleNext = () => {
        saveOffset(offset => offset + LAZY_LOAD_BATCH);
    };

    if (images === null) return null;

    return (
        <Box display="flex" alignItems="center" justifyContent="center" mt={4} mb={5}>
            <Paper>
                <ButtonGroup color="primary" variant="outlined">
                    <Button disabled={images.length === 0 || offset <= 0} onClick={handlePrevious}>
                        Previous
                    </Button>
                    <Button
                        disabled={images.length === 0 || offset >= imagesCount - LAZY_LOAD_BATCH}
                        onClick={handleNext}
                    >
                        Next
                    </Button>
                </ButtonGroup>
            </Paper>
        </Box>
    );
};

const DTImagesWrapper: FC<DTImagesWrapperProps> = ({ pipeline_id }) => {
    const classes = useStyles();

    const { dataset, pipelines } = useDataset();
    const { pipeline, savePipeline } = usePipeline();

    return (
        <>
            <div className={classes.sticky}>
                <FilterCategories />

                {pipeline_id ? (
                    <>
                        <ViewPipelineAction pipeline_id={pipeline_id} />
                        <DeletePipelineAction pipeline_id={pipeline_id} callback={() => {
                        }} />
                    </>
                ) : (
                    <UploadButton />
                )}

                <Box flexGrow={1} />

                <ButtonGroup size="small" color="primary">
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

            <Navigation />
        </>
    );
};

const ImagesStackPanel: FC<ImagesStackPanelProps> = ({ pipeline = {} }) => {
    const classes = useStyles();
    const { currentCategory } = useCategory();

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
