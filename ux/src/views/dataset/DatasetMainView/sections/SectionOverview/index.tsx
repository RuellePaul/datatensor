import React, {FC} from 'react';
import clsx from 'clsx';
import {Button, makeStyles} from '@material-ui/core';
import {Theme} from 'src/theme';
import {SectionProps} from '../SectionProps';
import useImages from 'src/hooks/useImages';

const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}));


const SectionOverview: FC<SectionProps> = ({className}) => {

    const classes = useStyles();

    const {images} = useImages();

    return (
        <div className={clsx(classes.root, className)}>
            {images.length > 0 && (
                <Button
                    onClick={() => window.location.hash = images[0].id}
                >
                    Labelisator
                </Button>
            )}
        </div>
    )
};

export default SectionOverview;
