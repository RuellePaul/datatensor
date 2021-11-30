import React, {FC} from 'react';
import {useHistory} from 'react-router-dom';
import clsx from 'clsx';
import {Box, Button, Container, Grid, Typography} from '@mui/material';
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
        backgroundColor: theme.palette.background.default,
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
        [theme.breakpoints.down('md')]: {
            '& h1': {
                fontSize: 48
            },
            '& * ': {
                textAlign: 'center'
            }
        }
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
    const history = useHistory();

    return (
        <div className={clsx(classes.root, className)} {...rest}>
            <Container component="section" maxWidth="lg">
                <Grid container spacing={4}>
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
                        <Box mt={3}>
                            <Typography color="textSecondary">
                                Datatensor provides a powerful and accessible website of images datasets management,
                                enabling you to build your own computer vision models faster.
                            </Typography>
                        </Box>
                        <Box display="flex" mt={4}>
                            <Box mr={2}>
                                <Button
                                    onClick={() => history.push('/login')}
                                    endIcon={<ArrowIcon />}
                                    variant="contained"
                                    size="large"
                                >
                                    Get started
                                </Button>
                            </Box>
                            <Button
                                onClick={() => history.push('/docs')}
                                endIcon={<DocsIcon />}
                                variant="outlined"
                                size="large"
                            >
                                Documentation
                            </Button>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={7}>
                        <Box position="relative">
                            <div className={classes.image}>
                                <img alt="Presentation" src="/static/images/yolov4.gif" draggable={false} />
                            </div>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default Hero;
