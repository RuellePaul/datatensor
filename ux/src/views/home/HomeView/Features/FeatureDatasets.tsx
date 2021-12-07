import React, {FC} from 'react';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';
import DTDataset from 'src/components/core/Dataset';
import useDataset from 'src/hooks/useDataset';
import useImages from 'src/hooks/useImages';
import ImagesSlideshow from 'src/components/core/Images/ImagesSlideshow';

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

    const {dataset} = useDataset();
    const {images} = useImages();

    return (
        <div className={clsx(classes.root, className)} {...rest}>
            <DTDataset className={classes.dataset} dataset={dataset} image={images[0]} />

            <ImagesSlideshow/>
        </div>
    );
};

export default FeatureAugmentation;
