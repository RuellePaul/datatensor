import React, {FC} from 'react';
import clsx from 'clsx';
import {Skeleton} from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import MasonryItem from '@mui/lab/MasonryItem';
import makeStyles from '@mui/styles/makeStyles';
import DTImage from 'src/components/core/Images/Image';
import useImages from 'src/hooks/useImages';
import {Theme} from 'src/theme';
import {ImageProvider} from 'src/store/ImageContext';
import {LAZY_LOAD_BATCH} from 'src/constants';
import {Image} from 'src/types/image';

interface ImagesListProps {
    pipeline_id?: string;
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        overflow: 'hidden',
        minHeight: 600
    },
    grid: {
        display: 'flex',
        marginLeft: -10,
        width: 'auto',
        marginRight: 10
    },
    column: {
        paddingLeft: 10,
        backgroundClip: 'padding-box',
        '& > button': {
            margin: theme.spacing(0, 0, 1)
        }
    },
    image: {
        marginBottom: theme.spacing(1)
    },
    icon: {
        position: 'absolute',
        bottom: theme.spacing(1),
        right: theme.spacing(1),
        color: 'white',
        background: 'rgba(0, 0, 0, 0.25)'
    }
}));

const DTImagesList: FC<ImagesListProps> = ({className, pipeline_id, ...rest}) => {
    const classes = useStyles();

    const {images} = useImages();

    if (images === null) return null;

    if (images.length === 0)
        return (
            <div className={clsx(classes.root, className)} {...rest}>
                <Masonry columns={{xs: 2, sm: 3, md: 4}} spacing={1}>
                    {Array.from(Array(LAZY_LOAD_BATCH), () => null).map((_, index) => (
                        <MasonryItem key={`masonry_skeleton_${index}`}>
                            <Skeleton
                                component="div"
                                animation="wave"
                                width="100%"
                                height={Math.floor(180 + Math.random() * 100)}
                                variant="rectangular"
                            />
                        </MasonryItem>
                    ))}
                </Masonry>
            </div>
        );

    return (
        <div className={clsx(classes.root, className)} {...rest}>
            <Masonry columns={{xs: 2, sm: 3, md: 4}} spacing={1}>
                {images.map((image: Image) => (
                    <MasonryItem key={image.id}>
                        <ImageProvider image={image}>
                            <DTImage
                                className={classes.image}
                                clickable
                                onClick={() => (window.location.hash = image.id)}
                                skeleton
                            />
                        </ImageProvider>
                    </MasonryItem>
                ))}
            </Masonry>
        </div>
    );
};

export default DTImagesList;
