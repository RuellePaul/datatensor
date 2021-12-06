import React, {FC} from 'react';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';
import DTImage from 'src/components/core/Images/Image';
import {Grid, Typography} from '@mui/material';
import PipelineSample from 'src/components/core/PipelineSample';
import Pipeline from 'src/components/core/Pipeline';

interface FeaturesProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: `${theme.spacing(2)} !important`
    }
}));

const FeatureAugmentation: FC<FeaturesProps> = ({className, ...rest}) => {
    const classes = useStyles();

    return (
        <div className={clsx(classes.root, className)} {...rest}>
            <Grid container spacing={2}>
                <Grid item sm={6} xs={12}>
                    <Typography variant="overline" color="textPrimary" align="center" gutterBottom>
                        Operations pipeline
                    </Typography>

                    <Pipeline />
                </Grid>
                <Grid item sm={6} xs={12}>
                    <Typography variant="overline" color="textPrimary" align="center" gutterBottom>
                        Input image
                    </Typography>

                    <DTImage skeleton />

                    <Typography variant="overline" color="textPrimary" align="center" gutterBottom sx={{mt: 1}}>
                        Result
                    </Typography>

                    <PipelineSample />
                </Grid>
            </Grid>
        </div>
    );
};

export default FeatureAugmentation;
