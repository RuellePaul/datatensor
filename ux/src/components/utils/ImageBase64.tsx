import React, {FC, useEffect, useRef} from 'react';
import clsx from 'clsx';
import {ButtonBase, makeStyles} from '@material-ui/core';
import {Theme} from 'src/theme';
import {Label} from 'src/types/label';
import {drawLabels, reset} from 'src/utils/labeling';
import useDataset from 'src/hooks/useDataset';

interface ImageBase64Props {
    base64string: string;
    labels: Label[];
    className?: string;

    [key: string]: any;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'relative',
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

const ImageBase64: FC<ImageBase64Props> = ({base64string, labels, className, ...props}) => {

    const classes = useStyles();

    const {categories} = useDataset();

    const imageRef = useRef(null);
    const canvasRef = useRef(null);

    const handleLoad = () => {
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
    }, [labels, categories]);

    return (
        <ButtonBase
            className={clsx(classes.root, className)}
            {...props}
        >
            <img
                src={`data:image/png;base64, ${base64string}`}
                alt='Augmented sample'
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
};

export default ImageBase64;
