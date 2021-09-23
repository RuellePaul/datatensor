import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import {autoPlay} from 'react-swipeable-views-utils';
import {Button, Card, makeStyles, MobileStepper, Paper, Typography, useTheme} from '@material-ui/core';
import {KeyboardArrowLeft, KeyboardArrowRight} from '@material-ui/icons';
import DTImage from 'src/components/core/Images/Image';
import useImages from 'src/hooks/useImages';
import {ImageProvider} from 'src/store/ImageContext';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 410,
        flexGrow: 1,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        height: 50,
        paddingLeft: theme.spacing(4),
        backgroundColor: theme.palette.background.default,
    },
    img: {
        height: 255,
        display: 'block',
        maxWidth: 410,
        overflow: 'hidden',
        width: '100%',
    },
}));

function ImagesSlideshow() {

    const classes = useStyles();
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);

    const {images} = useImages();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step: number) => {
        setActiveStep(step);
    };

    if (images.length === 0)
        return null;

    return (
        <Card
            className={classes.root}
            variant='outlined'
        >
            <Paper square elevation={0} className={classes.header}>
                <Typography>{images[activeStep].name}</Typography>
            </Paper>
            <AutoPlaySwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
            >
                {images.map((image, index) => (
                    <ImageProvider
                        image={image}
                        key={image.id}
                    >
                        {Math.abs(activeStep - index) <= 2 ? (
                            <DTImage
                                className={classes.img}
                            />
                        ) : null}
                    </ImageProvider>
                ))}
            </AutoPlaySwipeableViews>
            <MobileStepper
                steps={images.length}
                position="static"
                variant="text"
                activeStep={activeStep}
                nextButton={
                    <Button size="small" onClick={handleNext} disabled={activeStep === images.length - 1}>
                        Next
                        {theme.direction === 'rtl' ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>}
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        {theme.direction === 'rtl' ? <KeyboardArrowRight/> : <KeyboardArrowLeft/>}
                        Back
                    </Button>
                }
            />
        </Card>
    );
}

export default ImagesSlideshow;