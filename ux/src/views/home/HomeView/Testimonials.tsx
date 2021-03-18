import React, {FC} from 'react';
import clsx from 'clsx';
import {Avatar, Box, Container, makeStyles, Typography} from '@material-ui/core';
import {Theme} from 'src/theme';

interface TestimonialsProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        paddingTop: 128,
        paddingBottom: 128
    },
    title: {
        fontWeight: theme.typography.fontWeightRegular
    },
    avatar: {
        width: 50,
        height: 50
    }
}));

const Testimonials: FC<TestimonialsProps> = ({className, ...rest}) => {
    const classes = useStyles();

    return (
        <div
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Container maxWidth="lg">
                <Typography
                    variant="h2"
                    align="center"
                    color="textPrimary"
                    className={classes.title}
                >
                    &quot;Datatensor builds some of the best tools for Object Detection Vision tasks.
                    <br/>
                    It will save you time.&quot;
                </Typography>
                <Box
                    mt={6}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Avatar
                        className={classes.avatar}
                        src="/static/home/paul.png"
                        alt="Creator"
                    />
                    <Box ml={2}>
                        <Typography
                            variant="body1"
                            color="textPrimary"
                        >
                            Paul Ruelle
                            <Typography
                                color="textSecondary"
                                display="inline"
                                component="span"
                            >
                                , co-creator of @Datatensor
                            </Typography>
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </div>
    );
};

export default Testimonials;
