import React, {FC} from 'react';
import {Button, makeStyles} from '@material-ui/core';
import {Theme} from 'src/theme';
import useImages from 'src/hooks/useImages';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}));

interface LabelisatorActionProps {
    className?: string
}

const LabelisatorAction: FC<LabelisatorActionProps> = ({className}) => {

    const classes = useStyles();

    const {images} = useImages();

    if (images.length === 0)
        return null;

    return (
        <div className={clsx(classes.root, className)}>
            <Button
                onClick={() => window.location.hash = images[0].id}
                variant='outlined'
            >
                Labelisator
            </Button>
        </div>
    )
};

export default LabelisatorAction;
