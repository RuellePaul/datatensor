import React, {FC, useState} from 'react';
import SwipeableViews from 'react-swipeable-views';
import {autoPlay} from 'react-swipeable-views-utils';
import clsx from 'clsx';
import {alpha, Grid, Hidden, IconButton} from '@mui/material';
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
        width: '100%',
        height: 'inherit',
        backgroundImage: `url(/static/images/app/share.svg)`,
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        [theme.breakpoints.down('sm')]: {
            backgroundImage: 'none'
        }
    },
    feature: {
        position: 'relative',
        width: '100%',
        height: '100%',
        color: theme.palette.text.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 500,
        margin: 'auto'
    },
    dataset: {
        background: alpha(theme.palette.background.paper, 0.7),
        margin: 'auto',
        borderRadius: 8,
        [theme.breakpoints.down('xs')]: {
            margin: theme.spacing(0, 2)
        }
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
        <Grid item md={7} xs={12} className={clsx(classes.root, className)} {...rest}>
            <div className={classes.feature}>
                <Hidden smDown>
                    <IconButton color="inherit" size="small" onClick={handleBack} disabled={activeStep === 0}>
                        <KeyboardArrowLeft />
                    </IconButton>
                </Hidden>

                <AutoPlaySwipeableViews
                    index={activeStep}
                    onChangeIndex={handleStepChange}
                    enableMouseEvents
                    interval={8000}
                >
                    <DTDataset
                        className={classes.dataset}
                        images={images.filter(image => image.dataset_id === dataset.id)}
                        onClick={() => {}}
                        disabled
                    />
                    {datasets.slice(1, datasets.length).map(dataset => (
                        <DatasetProvider dataset={dataset} categories={dataset.categories} key={dataset.id}>
                            <DTDataset
                                className={classes.dataset}
                                images={images.filter(image => image.dataset_id === dataset.id).slice(0)}
                                onClick={() => {}}
                                disabled
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
        </Grid>
    );
};

export default FeatureDatasets;
