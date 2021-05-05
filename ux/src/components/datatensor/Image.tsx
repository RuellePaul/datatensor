import React, {FC, useEffect, useRef} from 'react';
import clsx from 'clsx';
import {ButtonBase, makeStyles} from '@material-ui/core';
import {Theme} from 'src/theme';
import {Image} from 'src/types/image';
import {Label} from 'src/types/label';
import {drawLabels, reset} from 'src/utils/labeling';
import useDataset from 'src/hooks/useDataset';

interface DTImageProps {
    className?: string;
    image: Image;
    labels?: Label[];
    clickable?: boolean;
    onClick?: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'relative'
    },
    clickable: {
        '&:hover img': {
            boxShadow: theme.shadows[6],
            opacity: 0.85
        }
    },
    canvas: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
    },
}));


const DTImage: FC<DTImageProps> = ({
                                       className,
                                       image,
                                       labels = image.labels,
                                       clickable = false,
                                       ...rest
                                   }) => {
    const classes = useStyles();

    const {dataset} = useDataset();

    const imageRef = useRef(null);
    const canvasRef = useRef(null);

    const handleLoad = () => {
        if (canvasRef.current && imageRef.current?.complete) {
            reset(canvasRef.current);
            drawLabels(canvasRef.current, labels, dataset.objects, 0);
        }
    };

    useEffect(() => {
        if (canvasRef.current && imageRef.current?.complete) {
            reset(canvasRef.current);
            drawLabels(canvasRef.current, labels, dataset.objects, 0);
        }
    }, [labels, dataset.objects]);

    if (clickable)
        return (
            <ButtonBase
                className={clsx(classes.root, classes.clickable, className)}
                {...rest}
            >
                <img
                    src={image.path}
                    alt={image.name}
                    width="100%"
                    draggable={false}
                    onLoad={handleLoad}
                    ref={imageRef}
                />
                <canvas
                    className={classes.canvas}
                    ref={canvasRef}
                />
            </ButtonBase>
        );

    return (
        <div
            className={clsx(classes.root, className)}
            {...rest}
        >
            <img
                src={image.path}
                alt={image.name}
                width="100%"
                draggable={false}
                onLoad={handleLoad}
                ref={imageRef}
            />
            <canvas
                className={classes.canvas}
                ref={canvasRef}
            />
        </div>
    );
};

export default DTImage;
