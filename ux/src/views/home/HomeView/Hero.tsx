import React, {FC, useState} from 'react';
import {useHistory} from 'react-router-dom';
import clsx from 'clsx';
import {Box, Button, Container, Grid, Hidden, Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';
import {AutoStories as DocsIcon, NavigateNext as ArrowIcon} from '@mui/icons-material';

interface HeroProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        paddingTop: 64,
        display: 'flex',
        alignItems: 'center',
        height: 900,
        backgroundColor: theme.palette.background.paper,
        '& h1': {
            fontFamily:
                'PlusJakartaSans-ExtraBold, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
            fontSize: 64,
            fontWeight: 'bold',
            lineHeight: '1.11429',
            '& span': {
                fontSize: 'inherit',
                fontWeight: 'inherit',
                whiteSpace: 'nowrap'
            }
        },
        [theme.breakpoints.down('lg')]: {
            '& h1': {
                fontSize: 46
            }
        },
        [theme.breakpoints.down('md')]: {
            '& h1': {
                fontSize: 42
            },
            '& * ': {
                textAlign: 'center'
            }
        },
        [theme.breakpoints.down('sm')]: {
            '& h1': {
                fontSize: 36
            }
        }
    },
    actions: {
        display: 'flex',
        '& > *:first-child': {
            marginRight: theme.spacing(2)
        },
        [theme.breakpoints.down('md')]: {
            padding: theme.spacing(6, 2, 2),
            justifyContent: 'center'
        },
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            alignItems: 'center',
            '& > *:first-child': {
                marginRight: 0,
                marginBottom: theme.spacing(2)
            },
            '& button': {
                width: '100%'
            }
        }
    },
    video: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspectiveOrigin: 'left center',
        transformStyle: 'preserve-3d',
        perspective: 1500,
        '& > *': {
            maxWidth: '90%',
            height: 'auto',
            transform: 'rotateY(-35deg) rotateX(15deg)',
            backfaceVisibility: 'hidden',
            boxShadow: theme.shadows[16],
            aspectRatio: '640/360'
        }
    },
    shape: {
        position: 'absolute',
        top: 0,
        left: 0,
        '& > img': {
            maxWidth: '90%',
            height: 'auto'
        }
    }
}));

const MainVideo = () => {
    const classes = useStyles();

    const [videoLoaded, setVideoLoaded] = useState(false);

    return (
        <div className={classes.video}>
            <video
                className={clsx(videoLoaded === false && 'hide')}
                src="/static/images/home/yolov4.mp4"
                autoPlay
                draggable={false}
                loop
                muted
                onLoadedDataCapture={() => setVideoLoaded(true)}
            />
        </div>
    );
};

const Hero: FC<HeroProps> = ({className, ...rest}) => {
    const classes = useStyles();
    const history = useHistory();

    return (
        <div className={clsx(classes.root, className)} {...rest}>
            <Container component="section" maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item xs={12} md={5}>
                        <Typography variant="overline" color="textPrimary" fontSize={16}>
                            DATATENSOR
                        </Typography>
                        <Typography variant="h1" color="textPrimary">
                            <Typography component="span" color="primary">
                                Object detection
                            </Typography>{' '}
                            made easy
                        </Typography>
                        <Box mt={3} mb={4}>
                            <Typography color="textSecondary">
                                Datatensor provides a powerful and accessible website of image datasets management,
                                enabling you to build your own computer vision models faster.
                            </Typography>
                        </Box>

                        <Hidden mdUp>
                            <Box position="relative" display="flex" alignItems="center" justifyContent="center">
                                <MainVideo />
                            </Box>
                        </Hidden>

                        <Box className={classes.actions}>
                            <Button
                                onClick={() => history.push('/auth/login')}
                                endIcon={<ArrowIcon />}
                                variant="contained"
                                size="large"
                            >
                                Get started
                            </Button>

                            <Button
                                onClick={() => history.push('/docs/getting-started')}
                                endIcon={<DocsIcon />}
                                variant="outlined"
                                size="large"
                            >
                                Documentation
                            </Button>
                        </Box>
                    </Grid>

                    <Hidden mdDown>
                        <Grid item xs={12} md={7}>
                            <Box position="relative">
                                <MainVideo />
                            </Box>
                        </Grid>
                    </Hidden>
                </Grid>
            </Container>
        </div>
    );
};

export default Hero;
