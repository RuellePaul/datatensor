import React, {FC} from 'react';
import {Box, Button, ButtonGroup, Paper} from '@mui/material';
import {makeStyles} from '@mui/styles';
import DTImagesList from 'src/components/core/Images/ImagesList';
import useDataset from 'src/hooks/useDataset';
import {Theme} from 'src/theme';
import useCategory from 'src/hooks/useCategory';
import useImages from 'src/hooks/useImages';
import FilterCategories from './FilterCategories';
import ImagesActionsMenu from './ImagesActionsMenu';
import {LAZY_LOAD_BATCH} from 'src/constants';
import goToHash from 'src/utils/goToHash';

const useStyles = makeStyles((theme: Theme) => ({
    sticky: {
        position: 'sticky',
        top: 0,
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
            zIndex: 1000
        }
    }
}));

const Navigation: FC = () => {
    const {dataset} = useDataset();
    const {images, offset, saveOffset, totalImagesCount} = useImages();
    const {currentCategory} = useCategory();

    const imagesCount = currentCategory ? totalImagesCount : dataset.image_count;

    const handlePrevious = () => {
        saveOffset(offset => offset - LAZY_LOAD_BATCH);
    };

    const handleNext = () => {
        saveOffset(offset => offset + LAZY_LOAD_BATCH);
    };

    if (images === null || images.length < 1) return null;

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

const DTImagesWrapper: FC = () => {
    const classes = useStyles();

    return (
        <>
            <div className={classes.sticky}>
                <FilterCategories />

                <ImagesActionsMenu />
            </div>

            <DTImagesList onClick={image => goToHash(image.id, true)} />

            <Navigation />
        </>
    );
};

export default DTImagesWrapper;
