import React, {FC} from 'react';
import clsx from 'clsx';
import {Button, Card, CardActions, CardContent, Typography} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {CreateOutlined as LabelisatorIcon} from '@mui/icons-material';
import Categories from 'src/components/core/Dataset/Categories';
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
            <CardContent>
                <Typography color="textPrimary" gutterBottom>
                    This dataset currently contains <strong>{totalLabelsCount} labels.</strong>
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                    {totalLabelsCount > 0 ? 'Edit labels' : 'Start labeling'} with labelisator tool.
                </Typography>

                <Categories />
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
