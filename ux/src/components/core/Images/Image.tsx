import React, {FC, ReactNode, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import {ButtonBase, Skeleton} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';
import {drawLabels, reset} from 'src/utils/labeling';
import useDataset from 'src/hooks/useDataset';
import useImage from 'src/hooks/useImage';
import {useTabContext} from '@mui/lab';


interface DTImageProps {
    className?: string;
    clickable?: boolean;
    overlay?: ReactNode;
    skeleton?: boolean;
    fullWidth?: boolean;
    onClick?: () => void;
    style?: object;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'relative',
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
    },
    skeleton: {
        maxWidth: '100% !important',
        maxHeight: '50vw !important'
    }
}));

const DTImage: FC<DTImageProps> = ({
    className,
    clickable = false,
    overlay = null,
    skeleton = false,
    fullWidth = false,
    ...rest
}) => {
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

    if (clickable)
        return (
            <div className={clsx(classes.root, classes.clickable, className)}>
                <ButtonBase {...rest}>
                    <img
                        src={image?.path}
                        alt={image?.name}
                        width="100%"
                        draggable={false}
                        onLoad={handleLoad}
                        ref={imageRef}
                    />
                    <canvas className={classes.canvas} ref={canvasRef} />
                </ButtonBase>
                {overlay && <div className="overlay">{overlay}</div>}
            </div>
        );

    return (
        <>
            {skeleton && (
                <Skeleton
                    className={clsx(classes.skeleton, loaded && 'hidden')}
                    animation="wave"
                    width={fullWidth ? '100%' : image?.width}
                    height={image?.height}
                    variant="rectangular"
                />
            )}
            <div className={clsx(classes.root, className, skeleton && !loaded && 'hidden')} {...rest}>
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
        </>
    );
};

export default DTImage;
