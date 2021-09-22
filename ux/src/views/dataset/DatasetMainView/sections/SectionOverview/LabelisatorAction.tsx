import React, {FC} from 'react';
import clsx from 'clsx';
import {Button, Card, CardActions, CardContent, makeStyles, Typography} from '@material-ui/core';
import {Theme} from 'src/theme';
import useDataset from 'src/hooks/useDataset';
import useImages from 'src/hooks/useImages';

const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}));

interface LabelisatorActionProps {
    className?: string
}

const LabelisatorAction: FC<LabelisatorActionProps> = ({className}) => {

    const classes = useStyles();

    const {categories} = useDataset();
    const {images} = useImages();

    const totalLabelsCount = categories
        .map(category => category.labels_count || 0)
        .reduce((acc, val) => acc + val, 0)

    if (images.length === 0)
        return null;

    return (
        <Card
            className={clsx(classes.root, className)}
            variant='outlined'
        >
            <CardContent>
                <Typography
                    color='textPrimary'
                    gutterBottom
                >
                    This dataset currently contains
                    {' '}
                    <strong>
                        {totalLabelsCount} labels.
                    </strong>
                </Typography>
                <Typography
                    color='textSecondary'
                    gutterBottom
                >
                    {totalLabelsCount > 0 ? 'Edit labels' : 'Start labeling'} with our labelisator tool.
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    color='primary'
                    onClick={() => window.location.hash = images[0].id}
                    variant='outlined'
                >
                    Labelisator
                </Button>
            </CardActions>
        </Card>
    )
};

export default LabelisatorAction;
