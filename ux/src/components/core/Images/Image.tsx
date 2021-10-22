import React, {FC, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import {Box, ButtonBase, Skeleton} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';
import {drawLabels, reset} from 'src/utils/labeling';
import useDataset from 'src/hooks/useDataset';
import useImage from 'src/hooks/useImage';
import {useTabContext} from '@mui/lab';

interface DTImageProps {
    className?: string;
    clickable?: boolean;
    skeleton?: boolean;
    onClick?: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'relative',
        width: '100%'
    },
    wrapper: {
        position: 'relative',
        '& img': {
            height: '100%',
            border: 'solid 1px black',
            boxShadow: '0px 0px 2px black'
        },
        '& .overlay': {
            display: 'none',
            zIndex: 1100,
            '& > *': {
                zIndex: 1100
            }
        },
        '&:hover .overlay': {
            display: 'initial !important'
        }
    },
    clickable: {
        zIndex: 1000,
        '& .MuiTouchRipple-root': {
            zIndex: 1000
        },
        '&:hover img': {
            filter: 'brightness(0.75)'
        }
    },
    canvas: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1
    }
}));

const DTImage: FC<DTImageProps> = ({className, clickable = false, skeleton = false, onClick = () => {}}) => {
    const classes = useStyles();

    const {categories} = useDataset();
    const {image, labels} = useImage();

    const imageRef = useRef(null);
    const canvasRef = useRef(null);

    const {value} = useTabContext();

    const [loaded, setLoaded] = useState<boolean>(false);

    const handleLoad = () => {
        if (imageRef.current?.complete) setLoaded(true);

        if (canvasRef.current && imageRef.current?.complete) {
            reset(canvasRef.current);
            drawLabels(canvasRef.current, labels, categories, 0);
        }
    };

    useEffect(() => {
        if (canvasRef.current && imageRef.current?.complete) {
            reset(canvasRef.current);
            drawLabels(canvasRef.current, labels, categories, 0);
        }
    }, [labels, categories, value, loaded]);

    return (
        <Box className={clsx(classes.root, className)} style={{aspectRatio: `${image.width} / ${image.height}`}}>
            {skeleton && (
                <Skeleton className={clsx(loaded && 'hidden')} animation="wave" height="100%" variant="rectangular" />
            )}
            {clickable ? (
                <ButtonBase className={clsx(classes.wrapper, skeleton && !loaded && 'hidden')} onClick={onClick}>
                    <img
                        src={image?.path}
                        alt={image?.name}
                        width="100%"
                        draggable={false}
                        onLoad={handleLoad}
                        ref={imageRef}
                    />
                    <canvas className={clsx(classes.canvas)} ref={canvasRef} />
                </ButtonBase>
            ) : (
                <div className={clsx(classes.wrapper, skeleton && !loaded && 'hidden')}>
                    <img
                        src={image?.path}
                        alt={image?.name}
                        width="100%"
                        draggable={false}
                        onLoad={handleLoad}
                        ref={imageRef}
                    />
                    <canvas className={clsx(classes.canvas)} ref={canvasRef} />
                </div>
            )}
        </Box>
    );
};

export default DTImage;
