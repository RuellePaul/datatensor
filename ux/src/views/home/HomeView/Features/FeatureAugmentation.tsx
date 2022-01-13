import React, {FC, useCallback, useState} from 'react';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';
import {Box, Button, Grid, Hidden, Typography} from '@mui/material';
import {ExpandLess, ExpandMore} from '@mui/icons-material';
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
        padding: `${theme.spacing(2)} !important`
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

    const [expand, setExpand] = useState<boolean>(false);
    const handleTogglePipeline = () => {
        setExpand(expand => !expand);
    };

    return (
        <div className={clsx(classes.root, className)} {...rest}>
            <Grid container spacing={2}>
                <Grid item sm={7} xs={12}>
                    <Box mb={1}>
                        <DTImage skeleton />
                    </Box>

                    <PipelineSample handler={handleSample} />
                </Grid>
                <Grid item sm={5} xs={12}>
                    <Hidden smDown>
                        <Typography variant="overline" color="textPrimary" gutterBottom>
                            Operations pipeline
                        </Typography>

                        <Pipeline />
                    </Hidden>
                    <Hidden smUp>
                        <Button
                            fullWidth
                            size="small"
                            endIcon={expand ? <ExpandLess /> : <ExpandMore />}
                            onClick={handleTogglePipeline}
                            sx={{mb: 1}}
                        >
                            Operations pipeline
                        </Button>

                        <Pipeline className={clsx(!expand && 'hidden')}/>
                    </Hidden>
                </Grid>
            </Grid>
        </div>
    );
};

export default FeatureAugmentation;
