import React, {FC} from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core';
import {Theme} from 'src/theme';
import {SectionProps} from '../SectionProps';
import Categories from 'src/components/core/Dataset/Categories';
import LabelisatorAction from './LabelisatorAction';

const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}));


const SectionOverview: FC<SectionProps> = ({className}) => {

    const classes = useStyles();

    return (
        <div className={clsx(classes.root, className)}>
            <LabelisatorAction/>

            <Categories/>
        </div>
    )
};

export default SectionOverview;
