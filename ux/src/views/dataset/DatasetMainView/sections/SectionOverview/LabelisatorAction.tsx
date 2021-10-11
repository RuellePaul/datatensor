import React, {FC} from 'react';
import clsx from 'clsx';
import {Button, Card, CardActions, CardContent, CardHeader, Typography} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {BrandingWatermarkOutlined as LabelisatorIcon} from '@mui/icons-material';
import {Theme} from 'src/theme';
import useDataset from 'src/hooks/useDataset';
import useImages from 'src/hooks/useImages';

const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}));

interface LabelisatorActionProps {
    className?: string;
}

const LabelisatorAction: FC<LabelisatorActionProps> = ({className}) => {
    const classes = useStyles();

    const {categories} = useDataset();
    const {images} = useImages();

    const totalLabelsCount = categories.map(category => category.labels_count || 0).reduce((acc, val) => acc + val, 0);

    if (images.length === 0) return null;

    return (
        <Card className={clsx(classes.root, className)} variant="outlined">
            <CardHeader title="Labelisator" />
            <CardContent>
                <Typography gutterBottom>
                    {totalLabelsCount > 0 ? 'Edit labels' : 'Start labeling'} with labelisator tool.
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    Lorem ipsum dolor
                </Typography>
            </CardContent>
            <CardActions style={{justifyContent: 'flex-end'}}>
                <Button
                    color="primary"
                    disabled={!!window.location.hash}
                    onClick={() => (window.location.hash = images[0].id)}
                    endIcon={<LabelisatorIcon />}
                    variant="contained"
                >
                    Labelisator
                </Button>
            </CardActions>
        </Card>
    );
};

export default LabelisatorAction;
