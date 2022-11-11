import React, {FC, ReactNode, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import {Box, ButtonBase, Skeleton} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';
import useCategory from 'src/hooks/useCategory';
import useDataset from 'src/hooks/useDataset';
import useImage from 'src/hooks/useImage';
import {Category} from 'src/types/category';
import {drawLabels, reset} from 'src/utils/labeling';

interface DTImageProps {
    className?: string;
    clickable?: boolean;
    skeleton?: boolean;
    overlay?: ReactNode;
    onClick?: () => void;
    highlightCategory?: Category;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'relative',
        width: '100%',
        '& .overlay': {
            zIndex: 1050,
            '& > *': {
                zIndex: 1050
            }
        }
    },
    wrapper: {
        position: 'relative',
        '& img': {
            height: '100%',
            border: theme.palette.mode === 'dark' ? 'solid 1px black' : 'none',
            boxShadow: '0px 0px 2px black'
        }
    },
    clickable: {
        zIndex: 1000,
        '& .MuiTouchRipple-root': {
            zIndex: 1000
        },
        '&:hover img': {
            filter: 'brightness(0.85)'
        }
    },
    canvas: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        opacity: 0.95
    }
}));

const DTImage: FC<DTImageProps> = ({
    className,
    clickable = false,
    skeleton = false,
    overlay = null,
    onClick = () => {},
    highlightCategory = null
}) => {
    const classes = useStyles();

    const {categories} = useDataset();
    const {currentCategory} = useCategory();
    const {image, labels} = useImage();

    const imageRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [loaded, setLoaded] = useState<boolean>(false);

    const handleLoad = () => {
        if (imageRef.current.complete) setLoaded(true);

        if (canvasRef.current && imageRef.current.complete) {
            reset(canvasRef.current);
            drawLabels(canvasRef.current, labels, categories, 0, 0, false, false, currentCategory, highlightCategory);
        }
    };

    useEffect(() => {
        if (canvasRef.current && imageRef.current.complete) {
            reset(canvasRef.current);
            drawLabels(canvasRef.current, labels, categories, 0, 0, false, false, currentCategory, highlightCategory);
        }
    }, [labels, categories, loaded, currentCategory, highlightCategory]);

    return (
        <Box className={clsx(classes.root, className)} style={{aspectRatio: `${image.width} / ${image.height}`}}>
            {skeleton && (
                <Skeleton className={clsx(loaded && 'hidden')} animation="wave" height="100%" variant="rectangular" />
            )}
            {clickable ? (
                <ButtonBase
                    className={clsx(classes.wrapper, classes.clickable, skeleton && !loaded && 'hidden')}
                    onClick={onClick}
                >
                    <img
                        src={image?.path}
                        alt={image?.name}
                        width="100%"
                        draggable={false}
                        onLoad={handleLoad}
                        ref={imageRef}
                    />
                    <canvas className={clsx(classes.canvas, highlightCategory && 'labelHighlight')} ref={canvasRef} />
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
                    <canvas className={clsx(classes.canvas, highlightCategory && 'labelHighlight')} ref={canvasRef} />
                </div>
            )}
            {overlay && loaded && <div className="overlay">{overlay}</div>}
        </Box>
    );
};

export default DTImage;
