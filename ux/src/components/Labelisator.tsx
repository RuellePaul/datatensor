import React, {FC} from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core';
import {Theme} from 'src/theme';
import DTImage from 'src/components/Image';
import useImages from 'src/hooks/useImages';

interface DTLabelisatorProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'relative',
    },
    canvas: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1000,
        cursor: 'crosshair'
    }
}));

const DTLabelisator: FC<DTLabelisatorProps> = ({
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
            <canvas
                className={classes.canvas}
            />
            <DTImage
                image={images[0]}
            />
        </div>
    );
};

export default DTLabelisator;
