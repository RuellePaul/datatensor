import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import {autoPlay} from 'react-swipeable-views-utils';
import {
    Box,
    Button,
    Card,
    MobileStepper,
    Paper,
    Typography,
    useTheme
} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {
    ImageOutlined as ImageIcon,
    KeyboardArrowLeft,
    KeyboardArrowRight
} from '@mui/icons-material';
import DTImage from 'src/components/core/Images/Image';
import useImages from 'src/hooks/useImages';
import {ImageProvider} from 'src/store/ImageContext';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: 410,
        flexGrow: 1
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        padding: theme.spacing(0, 2),
        backgroundColor: theme.palette.background.default
    },
    img: {
        height: 255,
        display: 'block',
        maxWidth: 410,
        overflow: 'hidden',
        width: '100%'
    },
    button: {
        minWidth: 75,
        marginLeft: theme.spacing(1)
    }
}));

function ImagesSlideshow() {
    const classes = useStyles();
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);

    const {images} = useImages();

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const handleStepChange = (step: number) => {
        setActiveStep(step);
    };

    if (images.length === 0) return null;

    return (
        <Card className={classes.root} variant="outlined">
            <Paper square elevation={0} className={classes.header}>
                <Box display="flex" alignItems="center">
                    <Box mr={1}>
                        <ImageIcon />
                    </Box>
                    <Typography variant="overline" noWrap>
                        {images[activeStep].name}
                    </Typography>
                </Box>
                <Button
                    className={classes.button}
                    onClick={() =>
                        document.getElementById('dt-tab-images').click()
                    }
                    size="small"
                >
                    View all
                </Button>
            </Paper>
            <AutoPlaySwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
            >
                {images.map((image, index) => (
                    <ImageProvider image={image} key={image.id}>
                        {Math.abs(activeStep - index) <= 2 ? (
                            <DTImage className={classes.img} />
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
                    <Button
                        size="small"
                        onClick={handleNext}
                        disabled={activeStep === images.length - 1}
                    >
                        Next
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowLeft />
                        ) : (
                            <KeyboardArrowRight />
                        )}
                    </Button>
                }
                backButton={
                    <Button
                        size="small"
                        onClick={handleBack}
                        disabled={activeStep === 0}
                    >
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowRight />
                        ) : (
                            <KeyboardArrowLeft />
                        )}
                        Back
                    </Button>
                }
            />
        </Card>
    );
}

export default ImagesSlideshow;
