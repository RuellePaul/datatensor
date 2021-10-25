import React, {FC} from 'react';
import {Box, Button, ButtonGroup, Paper} from '@mui/material';
import {makeStyles} from '@mui/styles';
import DTImagesList from 'src/components/core/Images/ImagesList';
import useDataset from 'src/hooks/useDataset';
import {Theme} from 'src/theme';
import useCategory from 'src/hooks/useCategory';
import useImages from 'src/hooks/useImages';
import usePipeline from 'src/hooks/usePipeline';
import FilterCategories from './FilterCategories';
import ImagesActionsMenu from './ImagesActionsMenu';
import {ImagesProvider} from 'src/store/ImagesContext';
import {Pipeline} from 'src/types/pipeline';
import {LAZY_LOAD_BATCH} from 'src/constants';

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    sticky: {
        position: 'sticky',
        top: 49,
        zIndex: 1100,
        background: theme.palette.background.default,
        color: theme.palette.text.primary,
        padding: theme.spacing(1.5, 0),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '& .MuiButton-contained': {
            background: theme.palette.text.primary,
            color: theme.palette.getContrastText(theme.palette.text.primary)
        },
        [theme.breakpoints.down('md')]: {
            position: 'relative',
            top: 0,
            zIndex: 1000,
            flexDirection: 'column-reverse'
        }
    },
    wrapper: {
        display: 'flex',
        alignItems: 'center',
        [theme.breakpoints.down('md')]: {
            marginBottom: theme.spacing(1.5)
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
    const {dataset, pipelines} = useDataset();
    const {pipeline} = usePipeline();
    const {images, offset, saveOffset, totalImagesCount} = useImages();
    const {currentCategory} = useCategory();

    const imagesCount = currentCategory
        ? totalImagesCount
        : pipeline?.id
        ? pipelines.find(current => current.id === pipeline.id).image_count
        : dataset.image_count;

    const handlePrevious = () => {
        saveOffset(offset => offset - LAZY_LOAD_BATCH);
        document.querySelector('.scroller').scrollTo(0, 64);
    };

    const handleNext = () => {
        saveOffset(offset => offset + LAZY_LOAD_BATCH);
        document.querySelector('.scroller').scrollTo(0, 64);
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

const DTImagesWrapper: FC<DTImagesWrapperProps> = ({pipeline_id}) => {
    const classes = useStyles();

    const {dataset, pipelines} = useDataset();
    const {pipeline, savePipeline} = usePipeline();

    return (
        <>
            <div className={classes.sticky}>
                <FilterCategories />

                <div className={classes.wrapper}>
                    {pipelines.length > 0 && (
                        <ButtonGroup color="inherit" size="small">
                            <Button
                                onClick={() => savePipeline(null)}
                                variant={pipeline === null ? 'contained' : 'outlined'}
                            >
                                Original ({dataset.image_count})
                            </Button>
                            {pipelines.map(current => (
                                <Button
                                    key={current.id}
                                    onClick={() => savePipeline(current)}
                                    variant={pipeline !== null ? 'contained' : 'outlined'}
                                >
                                    Augmented ({current.image_count})
                                </Button>
                            ))}
                        </ButtonGroup>
                    )}

                    <Box ml={2}>
                        <ImagesActionsMenu />
                    </Box>
                </div>
            </div>

            <DTImagesList pipeline_id={pipeline_id} />

            <Navigation />
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
