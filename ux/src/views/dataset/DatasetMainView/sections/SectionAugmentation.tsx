import React, {FC, useEffect, useState} from 'react';
import clsx from 'clsx';
import {Button, Grid, makeStyles} from '@material-ui/core';
import {Refresh} from '@material-ui/icons';
import {Theme} from 'src/theme';
import AugmentorPipeline from 'src/components/datatensor/AugmentorPipeline';
import DTImage from 'src/components/datatensor/Image';
import useImages from 'src/hooks/useImages';
import {ImageProvider} from 'src/store/ImageContext';
import {SectionProps} from './SectionProps';
import {Image} from 'src/types/image';

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    refresh: {
        width: '100%',
        margin: theme.spacing(1, 'auto')
    }
}));


const SectionAugmentation: FC<SectionProps> = ({className}) => {

    const classes = useStyles();

    const {images} = useImages();

    const [randomImage, setRandomImage] = useState<Image | null>(null);

    const pickRandomImage = () => setRandomImage(images[Math.floor(Math.random() * images.length)]);

    useEffect(() => {
        pickRandomImage();

        // eslint-disable-next-line
    }, [images]);

    if (!randomImage)
        return null;

    return (
        <div className={clsx(classes.root, className)}>
            <ImageProvider
                image={randomImage}
            >
                <Grid
                    container
                    spacing={4}
                >
                    <Grid
                        item
                        sm={3}
                        xs={12}
                    >
                        <Button
                            className={classes.refresh}
                            onClick={pickRandomImage}
                            startIcon={<Refresh/>}
                            size='small'
                        >
                            Random image
                        </Button>

                        <DTImage/>
                    </Grid>
                    <Grid
                        item
                        sm={4}
                        xs={12}
                    >
                        <AugmentorPipeline/>
                    </Grid>
                </Grid>
            </ImageProvider>
        </div>
    )
};

export default SectionAugmentation;
