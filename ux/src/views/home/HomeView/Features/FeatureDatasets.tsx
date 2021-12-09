import React, {FC, useState} from 'react';
import SwipeableViews from 'react-swipeable-views';
import {autoPlay} from 'react-swipeable-views-utils';
import clsx from 'clsx';
import {Hidden, IconButton} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {KeyboardArrowLeft, KeyboardArrowRight} from '@mui/icons-material';
import {Theme} from 'src/theme';
import DTDataset from 'src/components/core/Dataset';
import useImages from 'src/hooks/useImages';
import useDataset from 'src/hooks/useDataset';
import {Dataset} from 'src/types/dataset';
import {DatasetProvider} from 'src/store/DatasetContext';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

interface FeatureProps {
    datasets: Dataset[] | null;
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        color: theme.palette.text.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `${theme.palette.background.default} !important`,
        border: 'none !important',
        padding: `0px !important`,
        margin: theme.spacing(6, 'auto'),
        maxWidth: 500
    },
    dataset: {
        margin: 'auto',
        borderRadius: 8
    }
}));

const FeatureDatasets: FC<FeatureProps> = ({className, datasets = null, ...rest}) => {
    const classes = useStyles();

    const {dataset} = useDataset();
    const {images} = useImages();

    const [activeStep, setActiveStep] = useState(0);

    const handleStepChange = (step: number) => {
        setActiveStep(step);
    };
    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    return (
        <div className={clsx(classes.root, className)} {...rest}>
            <Hidden smDown>
                <IconButton color="inherit" size="small" onClick={handleBack} disabled={activeStep === 0}>
                    <KeyboardArrowLeft />
                </IconButton>
            </Hidden>

            <AutoPlaySwipeableViews
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
                interval={5000}
            >
                <DTDataset
                    className={classes.dataset}
                    image={images.filter(image => image.dataset_id === dataset.id)[0]}
                    onClick={() => {}}
                />
                {datasets.slice(1, datasets.length).map(dataset => (
                    <DatasetProvider dataset={dataset} categories={dataset.categories} key={dataset.id}>
                        <DTDataset
                            className={classes.dataset}
                            image={images.filter(image => image.dataset_id === dataset.id)[0]}
                            onClick={() => {}}
                        />
                    </DatasetProvider>
                ))}
            </AutoPlaySwipeableViews>

            <Hidden smDown>
                <IconButton
                    color="inherit"
                    size="small"
                    onClick={handleNext}
                    disabled={activeStep === datasets.length - 1}
                >
                    <KeyboardArrowRight />
                </IconButton>
            </Hidden>
        </div>
    );
};

export default FeatureDatasets;
