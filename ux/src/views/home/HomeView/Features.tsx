import React, {FC} from 'react';
import clsx from 'clsx';
import {Avatar, Box, Button, Container, Grid, makeStyles, Typography} from '@material-ui/core';
import {Theme} from 'src/theme';

interface FeaturesProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        paddingTop: 128,
        paddingBottom: 128
    },
    avatar: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText
    }
}));

const Features: FC<FeaturesProps> = ({className, ...rest}) => {
    const classes = useStyles();

    return (
        <div
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Container maxWidth="lg">
                <Typography
                    component="p"
                    variant="overline"
                    color="secondary"
                    align="center"
                >
                    Explore Datatensor
                </Typography>
                <Typography
                    variant="h1"
                    align="center"
                    color="textPrimary"
                >
                    Not just a pretty face
                </Typography>
                <Box mt={8}>
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid
                            item
                            xs={12}
                            md={4}
                        >
                            <Box display="flex">
                                <Avatar className={classes.avatar}>
                                    01
                                </Avatar>
                                <Box ml={2}>
                                    <Typography
                                        variant="h4"
                                        gutterBottom
                                        color="textPrimary"
                                    >
                                        Complete Dataset Flows
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="textPrimary"
                                    >
                                        Not just a set of tools, the application includes the most common use cases of
                                        image dataset flows like object labeling, web scraping, image augmentation...
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={4}
                        >
                            <Box display="flex">
                                <Avatar className={classes.avatar}>
                                    02
                                </Avatar>
                                <Box ml={2}>
                                    <Typography
                                        variant="h4"
                                        gutterBottom
                                        color="textPrimary"
                                    >
                                        On-board integration support
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="textPrimary"
                                    >
                                        Once you have trained models, you can use Datatensor API to make real-time
                                        inference.
                                    </Typography>
                                    <Box mt={2}>
                                        <Button
                                            variant="outlined"
                                            component="a"
                                            href="https://www.google.com"
                                            target="_blank"
                                        >
                                            Getting started
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={4}
                        >
                            <Box display="flex">
                                <Avatar className={classes.avatar}>
                                    03
                                </Avatar>
                                <Box ml={2}>
                                    <Typography
                                        variant="h4"
                                        gutterBottom
                                        color="textPrimary"
                                    >
                                        Developers, we got you
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="textPrimary"
                                        gutterBottom
                                    >
                                        We&apos;ve included the feature to export dataset state.
                                        Check our docs to use Datatensor in combination of your
                                        existing backend Python code !
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </div>
    );
};

export default Features;
