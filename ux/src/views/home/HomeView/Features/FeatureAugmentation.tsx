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

interface FeatureProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        backgroundImage: `url(/static/images/app/space-girl.svg)`,
        backgroundPosition: 'left bottom',
        backgroundSize: '50%',
        backgroundRepeat: 'no-repeat',
        perspectiveOrigin: 'center',
        perspective: 3000,
        [theme.breakpoints.down('md')]: {
            backgroundImage: 'none',
            perspective: 0
        }
    },
    feature: {
        position: 'relative',
        padding: theme.spacing(1),
        width: '100%',
        maxWidth: 570,
        transform: 'rotateY(330deg) rotateX(342deg) rotateZ(3deg)',
        marginLeft: 'auto',
        backfaceVisibility: 'hidden',
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
        border: `solid 1px ${theme.palette.divider}`,
        borderRadius: 8,
        touchAction: 'pan-y',
        [theme.breakpoints.down('md')]: {
            transform: 'none',
            margin: 'auto'
        }
    }
}));

const FeatureAugmentation: FC<FeatureProps> = ({className, ...rest}) => {
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
        <Grid item md={7} xs={12} className={clsx(classes.root, className)} {...rest}>
            <Box className={classes.feature}>
                <Grid container spacing={2}>
                    <Grid item sm={7} xs={12}>
                        <Box mb={1}>
                            <DTImage skeleton />
                        </Box>

                        <PipelineSample handler={handleSample} />
                    </Grid>
                    <Grid item sm={5} xs={12}>
                        <Typography variant="overline" color="textPrimary" gutterBottom>
                            Operations pipeline
                        </Typography>

                        <Pipeline />
                    </Grid>
                </Grid>
            </Box>
        </Grid>
    );
};

export default FeatureAugmentation;
