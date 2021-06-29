import React, {FC, useCallback, useEffect, useState} from 'react';
import clsx from 'clsx';
import {Box, Button, Grid, makeStyles, Typography} from '@material-ui/core';
import {Refresh} from '@material-ui/icons';
import {Theme} from 'src/theme';
import Pipeline from 'src/components/datatensor/Pipeline';
import PipelineSample from 'src/components/datatensor/PipelineSample';
import DTImage from 'src/components/datatensor/Image';
import useImages from 'src/hooks/useImages';
import {ImageProvider} from 'src/store/ImageContext';
import {SectionProps} from './SectionProps';

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        position: 'relative',
        '&:after': {
            position: 'absolute',
            bottom: -8,
            left: 0,
            content: '""',
            height: 3,
            width: 48,
            backgroundColor: theme.palette.primary.main
        }
    },
    wrapper: {
        border: `solid 1px ${theme.palette.divider}`,
        borderRadius: theme.spacing(0.5)
    },
    refresh: {
        width: '100%',
        margin: theme.spacing(1, 'auto')
    }
}));


const SectionAugmentation: FC<SectionProps> = ({className}) => {

    const classes = useStyles();

    const {images} = useImages();

    const [randomIndex, setRandomIndex] = useState<number | null>(0);

    const pickRandomImage = useCallback(() => {
        if (images) {
            let random = Math.floor(Math.random() * images.length);

            while (random === randomIndex) {
                random = Math.floor(Math.random() * images.length);
            }

            setRandomIndex(random);
        }
    }, [images, randomIndex]);

    useEffect(() => {
        pickRandomImage();

        // eslint-disable-next-line
    }, [images]);

    return (
        <div className={clsx(classes.root, className)}>
            <div className={classes.header}>
                <Typography
                    className={classes.title}
                    variant='h5'
                    color='textPrimary'
                >
                    Operation pipeline
                </Typography>

                <Box display='flex'>
                    <Button variant='contained' color='primary' size='small'>
                        Augment images
                    </Button>
                </Box>
            </div>

            <Box my={2}>
                <Typography
                    color='textSecondary'
                    gutterBottom
                >
                    Choose operations pipeline that fit the best for your dataset.
                </Typography>
            </Box>

            <ImageProvider
                image={images[randomIndex]}
            >
                <Grid
                    container
                    spacing={3}
                >
                    <Grid
                        item
                        md={3}
                        sm={6}
                        xs={12}
                    >
                        <Typography
                            variant='overline'
                            color='textPrimary'
                            align='center'
                            gutterBottom
                        >
                            Input image
                        </Typography>

                        <div className={classes.wrapper}>
                            <Button
                                className={classes.refresh}
                                onClick={pickRandomImage}
                                startIcon={<Refresh/>}
                                size='small'
                                disabled={images.length < 2}
                            >
                                Random image
                            </Button>

                            <DTImage/>
                        </div>
                    </Grid>
                    <Grid
                        item
                        md={3}
                        sm={6}
                        xs={12}
                    >
                        <Typography
                            variant='overline'
                            color='textPrimary'
                            align='center'
                            gutterBottom
                        >
                            Operation pipeline
                        </Typography>

                        <Pipeline/>
                    </Grid>
                    <Grid
                        item
                        md={6}
                        xs={12}
                    >
                        <Typography
                            variant='overline'
                            color='textPrimary'
                            align='center'
                            gutterBottom
                        >
                            Sample
                        </Typography>

                        <PipelineSample/>
                    </Grid>
                </Grid>
            </ImageProvider>
        </div>
    )
};

export default SectionAugmentation;
