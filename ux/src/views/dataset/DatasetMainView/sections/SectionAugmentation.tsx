import React, {FC} from 'react';
import {makeStyles} from '@material-ui/core';
import {Theme} from 'src/theme';
import Augmentor from 'src/components/datatensor/Augmentor';
import {SectionProps} from './SectionProps';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2, 0)
    }
}));


const SectionAugmentation: FC<SectionProps> = ({className}) => {

    const classes = useStyles();

    return (
        <div className={clsx(classes.root, className)}>

            <Augmentor/>

        </div>
    )
};

export default SectionAugmentation;
