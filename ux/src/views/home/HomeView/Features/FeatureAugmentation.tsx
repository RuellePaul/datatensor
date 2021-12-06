import React, {FC} from 'react';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';
import DTImage from 'src/components/core/Images/Image';
import {Grid, Hidden, Typography} from '@mui/material';
import PipelineSample from 'src/components/core/PipelineSample';
import Pipeline from 'src/components/core/Pipeline';
import api from 'src/utils/api';
import {Label} from 'src/types/label';
import useImage from 'src/hooks/useImage';

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

    const {image} = useImage();

    return (
        <div className={clsx(classes.root, className)} {...rest}>
            <Grid container spacing={2}>
                <Grid item sm={7} xs={12}>
                    <Typography variant="overline" color="textPrimary" align="center" gutterBottom>
                        Input image
                    </Typography>

                    <DTImage skeleton />

                    <Typography variant="overline" color="textPrimary" align="center" gutterBottom sx={{mt: 1}}>
                        Result
                    </Typography>

                    <PipelineSample
                        handler={operations =>
                            api.post<{images: string[]; images_labels: Label[][]}>(`/public/sample`, {
                                image_id: image.id,
                                operations
                            })
                        }
                    />
                </Grid>
                <Hidden smDown>
                    <Grid item sm={5} xs={12}>
                        <Typography variant="overline" color="textPrimary" align="center" gutterBottom>
                            Operations pipeline
                        </Typography>

                        <Pipeline />
                    </Grid>
                </Hidden>
            </Grid>
        </div>
    );
};

export default FeatureAugmentation;
