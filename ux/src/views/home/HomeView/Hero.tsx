import React, {FC} from 'react';
import clsx from 'clsx';
import {Box, Container, Grid, makeStyles, Typography} from '@material-ui/core';
import {Theme} from 'src/theme';

interface HeroProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        paddingTop: 200,
        paddingBottom: 200,
        [theme.breakpoints.down('md')]: {
            paddingTop: 60,
            paddingBottom: 60
        }
    },
    technologyIcon: {
        height: 40,
        margin: theme.spacing(1)
    },
    image: {
        perspectiveOrigin: 'left center',
        transformStyle: 'preserve-3d',
        perspective: 1500,
        '& > img': {
            maxWidth: '90%',
            height: 'auto',
            transform: 'rotateY(-35deg) rotateX(15deg)',
            backfaceVisibility: 'hidden',
            boxShadow: theme.shadows[16]
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

const Hero: FC<HeroProps> = ({className, ...rest}) => {
    const classes = useStyles();

    return (
        <div
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Container maxWidth="lg">
                <Grid
                    container
                    spacing={3}
                >
                    <Grid
                        item
                        xs={12}
                        md={5}
                    >
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            height="100%"
                        >
                            <Typography
                                variant="overline"
                                color="secondary"
                            >
                                Introducing
                            </Typography>
                            <Typography
                                variant="h1"
                                color="textPrimary"
                            >
                                Datatensor
                            </Typography>
                            <Box mt={3}>
                                <Typography
                                    variant="body1"
                                    color="textSecondary"
                                >
                                    A professional web application that comes with ready-to-use object detection models,
                                    developed with one goal in mind, help you build faster computer vision applications.
                                </Typography>
                            </Box>
                            <Box mt={3}>
                                <Grid
                                    container
                                    spacing={3}
                                >
                                    <Grid item>
                                        <Typography
                                            variant="h1"
                                            color="secondary"
                                        >
                                            30+
                                        </Typography>
                                        <Typography
                                            variant="overline"
                                            color="textSecondary"
                                        >
                                            Demo Pages
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            variant="h1"
                                            color="secondary"
                                        >
                                            UX
                                        </Typography>
                                        <Typography
                                            variant="overline"
                                            color="textSecondary"
                                        >
                                            Complete Flows
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            variant="h1"
                                            color="secondary"
                                        >
                                            10+
                                        </Typography>
                                        <Typography
                                            variant="overline"
                                            color="textSecondary"
                                        >
                                            Dataset Tools
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={7}
                    >
                        <Box position="relative">
                            <div className={classes.shape}>
                                <img
                                    alt="Shapes"
                                    src="/static/home/shapes.svg"
                                />
                            </div>
                            <div className={classes.image}>
                                <img
                                    alt="Presentation"
                                    src="https://via.placeholder.com/900x500"
                                />
                            </div>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default Hero;
