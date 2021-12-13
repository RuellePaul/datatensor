import React, {FC} from 'react';
import clsx from 'clsx';
import {Avatar, Box, Container, Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';

interface TestimonialsProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        paddingTop: 128,
        paddingBottom: 128
    },
    title: {
        fontWeight: theme.typography.fontWeightRegular
    },
    avatar: {
        width: 60,
        height: 60
    },
    creator: {
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'underline'
        }
    }
}));

const Testimonials: FC<TestimonialsProps> = ({className, ...rest}) => {
    const classes = useStyles();

    return (
        <div className={clsx(classes.root, className)} {...rest}>
            <Container component="section" maxWidth="lg">
                <Typography variant="h2" align="center" color="textPrimary" className={classes.title}>
                    &quot;Datatensor builds some of the best tools for Object Detection Vision tasks.
                    <br />
                    It will save you time.&quot;
                </Typography>
                <Box mt={6} display="flex" justifyContent="center" alignItems="center">
                    <Avatar
                        className={classes.avatar}
                        src="/static/home/paul.jpg"
                        alt="Creator"
                        imgProps={{loading: 'lazy'}}
                    />
                    <Box ml={2}>
                        <Typography variant="body1" color="textPrimary">
                            <span
                                className={classes.creator}
                                title="Github profile"
                                onClick={() => (window.location.href = 'https://github.com/RuellePaul')}
                            >
                                Paul
                            </span>
                            <Typography color="textSecondary" display="inline" component="span">
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
