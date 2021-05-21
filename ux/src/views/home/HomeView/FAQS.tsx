import React, {FC} from 'react';
import clsx from 'clsx';
import {Box, Container, Divider, Grid, makeStyles, Typography} from '@material-ui/core';
import {Theme} from 'src/theme';

interface FAQSProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        paddingTop: theme.spacing(6),
        paddingBottom: theme.spacing(6),
        '& dt': {
            marginTop: theme.spacing(2)
        }
    }
}));

const FAQS: FC<FAQSProps> = ({className, ...rest}) => {
    const classes = useStyles();

    return (
        <div
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Container maxWidth="lg">
                <Typography
                    variant="h1"
                    color="textPrimary"
                >
                    Frequently asked questions
                </Typography>
                <Box my={3}>
                    <Divider/>
                </Box>
                <Grid
                    container
                    spacing={3}
                    component="dl"
                >
                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <Typography
                            variant="overline"
                            color="secondary"
                        >
                            Technical
                        </Typography>
                        <Box mt={6}>
                            <dt>
                                <Typography
                                    variant="h4"
                                    color="textPrimary"
                                >
                                    What is it for?
                                </Typography>
                            </dt>
                            <dd>
                                <Typography
                                    variant="body1"
                                    color="textSecondary"
                                >
                                    Use Datatensor tools for creating and labeling images database (called `dataset`).
                                    These datasets can be used for training AI models, such as YOLOv3, to perform
                                    complex
                                    object detection tasks.
                                </Typography>
                            </dd>
                        </Box>
                        <Box mt={6}>
                            <dt>
                                <Typography
                                    variant="h4"
                                    color="textPrimary"
                                >
                                    Is this free?
                                </Typography>
                            </dt>
                            <dd>
                                <Typography
                                    variant="body1"
                                    color="textSecondary"
                                >
                                    Yes, you can use Datatensor freely upon a certain limit.
                                </Typography>
                            </dd>
                        </Box>
                        <Box mt={6}>
                            <dt>
                                <Typography
                                    variant="h4"
                                    color="textPrimary"
                                >
                                    Are you providing support for setting up my project?
                                </Typography>
                            </dt>
                            <dd>
                                <Typography
                                    variant="body1"
                                    color="textSecondary"
                                >
                                    Yes, we offer email support for all our customers &amp;
                                    even skype meetings for our extended license customers.
                                </Typography>
                            </dd>
                        </Box>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <Typography
                            variant="overline"
                            color="secondary"
                        >
                            Features
                        </Typography>
                        <Box mt={6}>
                            <dt>
                                <Typography
                                    variant="h4"
                                    color="textPrimary"
                                >
                                    Can I use Datatensor API to perform object detection on cats ?
                                </Typography>
                            </dt>
                            <dd>
                                <Typography
                                    variant="body1"
                                    color="textSecondary"
                                >
                                    Yes, for common objects you can browse existing public datasets, or create your
                                    own using our web scraping tool to begins with a dataset filled up with
                                    thousands of images of `cat` object.
                                </Typography>
                            </dd>
                        </Box>
                        <Box mt={6}>
                            <dt>
                                <Typography
                                    variant="h4"
                                    color="textPrimary"
                                >
                                    Can I use Datatensor API to perform object detection on custom objects ?
                                </Typography>
                            </dt>
                            <dd>
                                <Typography
                                    variant="body1"
                                    color="textSecondary"
                                >
                                    Yes, take several hundred pictures of your objects, upload them to a Datatensor
                                    dataset. Use Datatensor tools for labeling and augmenting images, then launch a
                                    training task on a model.
                                </Typography>
                            </dd>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};


export default FAQS;
