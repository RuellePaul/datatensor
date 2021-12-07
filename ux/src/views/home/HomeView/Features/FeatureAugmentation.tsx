import React, {FC, useCallback} from 'react';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';
import {Box, Grid, Typography} from '@mui/material';
import PipelineSample from 'src/components/core/PipelineSample';
import Pipeline from 'src/components/core/Pipeline';
import api from 'src/utils/api';
import {Label} from 'src/types/label';
import useImage from 'src/hooks/useImage';
import DTImage from 'src/components/core/Images/Image';

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

    const {image, labels} = useImage();

    const handleSample = useCallback(
        operations =>
            api.post<{images: string[]; images_labels: Label[][]}>(`/public/sample`, {
                image_id: image.id,
                labels,
                operations
            }),
        [image, labels]
    );

    return (
        <div className={clsx(classes.root, className)} {...rest}>
            <Grid container spacing={1}>
                <Grid item sm={7} xs={12}>
                    <Box mb={1}>
                        <DTImage skeleton />
                    </Box>

                    <PipelineSample handler={handleSample} />
                </Grid>
                <Grid item sm={5} xs={12}>
                    <Typography variant="overline" color="textPrimary" align="center" gutterBottom>
                        Operations pipeline
                    </Typography>

                    <Pipeline />
                </Grid>
            </Grid>
        </div>
    );
};

export default FeatureAugmentation;
