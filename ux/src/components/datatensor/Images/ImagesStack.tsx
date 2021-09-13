import React, {FC} from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core';
import DTImage from 'src/components/datatensor/Images/Image';
import useImages from 'src/hooks/useImages';
import {Theme} from 'src/theme';
import {ImageProvider} from 'src/store/ImageContext';

interface ImagesListProps {
    className?: string;
    onClick?: any;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'relative',
        width: '100%',
        maxWidth: 440,
        height: 300,
        margin: theme.spacing(1, 0, 3),
        '&:hover': {
            '& .layer-0': {
                transform: 'scale(1.01)'
            },
            '& .layer-1': {
                transform: 'translate(-5px, 5px) rotate(-6deg) scale(1.01)'
            },
            '& .layer-2': {
                transform: 'translate(0px, 10px) rotate(3deg) scale(1.01)'
            },
            '& .layer-3': {
                transform: 'translate(10px, 5px) rotate(5deg) scale(1.01)'
            }
        },
        '& button': {
            width: '100%'
        },
        '& img': {
            width: '100%',
            opacity: '1 !important'
        }
    },
    stack: {
        position: 'absolute',
        top: theme.spacing(1),
        left: theme.spacing(1),
        width: `calc(100% - ${theme.spacing(2)}px)`,
        maxHeight: 260,
        overflow: 'hidden',
        border: `solid 1px #000000cc`,
        boxShadow: theme.shadows[3],
        transition: 'transform 0.2s ease-in-out',
        transform: 'translate(0px, 0px)',
        cursor: 'pointer',
        '&.layer-0': {
            zIndex: 3,
            '& img, & canvas': {
                zIndex: 3
            }
        },
        '&.layer-1': {
            transform: 'translate(-5px, 5px) rotate(-5deg)',
            zIndex: 2,
            '& img, & canvas': {
                zIndex: 2
            }
        },
        '&.layer-2': {
            transform: 'translate(0px, 10px) rotate(2deg)',
            zIndex: 1,
            filter: 'blur(1px)',
            '& img, & canvas': {
                zIndex: 1
            }
        },
        '&.layer-3': {
            transform: 'translate(10px, 5px) rotate(4deg)',
            zIndex: 0,
            filter: 'blur(2px)',
            '& img, & canvas': {
                zIndex: 0
            }

        }
    }
}));

const STACK_IMAGE_COUNT = 4;

const DTImagesStack: FC<ImagesListProps> = ({
                                                className,
                                                ...rest
                                            }) => {

    const classes = useStyles();

    const {images} = useImages();

    return (
        <div
            className={clsx(classes.root, className)}
            {...rest}
        >
            {images
                .slice(0, STACK_IMAGE_COUNT)
                .map((image, index) => (
                    <div
                        className={clsx(classes.stack, `layer-${index}`)}
                        key={`layer-${index}`}
                    >
                        <ImageProvider
                            key={image.id}
                            image={image}
                        >
                            <DTImage
                                clickable={index === 0}
                            />
                        </ImageProvider>
                    </div>
                ))
            }

        </div>
    );
};

export default DTImagesStack;
