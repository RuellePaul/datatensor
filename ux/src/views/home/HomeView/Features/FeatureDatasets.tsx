import React, {FC, useState} from 'react';
import SwipeableViews from 'react-swipeable-views';
import {autoPlay} from 'react-swipeable-views-utils';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';
import DTDataset from 'src/components/core/Dataset';
import useImages from 'src/hooks/useImages';
import {IconButton} from '@mui/material';
import {KeyboardArrowLeft, KeyboardArrowRight} from '@mui/icons-material';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

interface FeatureProps {
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

const FeatureDatasets: FC<FeatureProps> = ({className, ...rest}) => {
    const classes = useStyles();

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
            <IconButton color="inherit" size="small" onClick={handleBack} disabled={activeStep === 0}>
                <KeyboardArrowLeft />
            </IconButton>

            <AutoPlaySwipeableViews index={activeStep} onChangeIndex={handleStepChange} enableMouseEvents>
                <DTDataset className={classes.dataset} image={images[0]} onClick={() => {}} />
                <DTDataset className={classes.dataset} image={images[0]} onClick={() => {}} />
            </AutoPlaySwipeableViews>

            <IconButton color="inherit" size="small" onClick={handleNext} disabled={activeStep === 1}>
                <KeyboardArrowRight />
            </IconButton>
        </div>
    );
};

export default FeatureDatasets;
