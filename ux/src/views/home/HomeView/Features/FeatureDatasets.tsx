import React, {FC} from 'react';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';
import DTDataset from 'src/components/core/Dataset';
import useImages from 'src/hooks/useImages';

interface FeaturesProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        background: `${theme.palette.background.default} !important`,
        border: 'none !important',
        padding: `0px !important`
    },
    dataset: {
        borderRadius: 8
    }
}));

const FeatureAugmentation: FC<FeaturesProps> = ({className, ...rest}) => {
    const classes = useStyles();

    const {images} = useImages();

    return (
        <div className={clsx(classes.root, className)} {...rest}>
            <DTDataset className={classes.dataset} image={images[0]} />
        </div>
    );
};

export default FeatureAugmentation;
