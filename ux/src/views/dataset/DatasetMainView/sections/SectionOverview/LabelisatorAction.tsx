import React, {FC} from 'react';
import clsx from 'clsx';
import {Button, Card, CardActions, CardContent, Link, Typography} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {BrandingWatermarkOutlined as LabelisatorIcon} from '@mui/icons-material';
import {Theme} from 'src/theme';
import useDataset from 'src/hooks/useDataset';
import useImages from 'src/hooks/useImages';
import {Link as RouterLink} from 'react-router-dom';
import goToHash from 'src/utils/goToHash';


const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}));

interface LabelisatorActionProps {
    className?: string;
}

const LabelisatorAction: FC<LabelisatorActionProps> = ({ className }) => {
    const classes = useStyles();

    const { categories } = useDataset();
    const { images } = useImages();

    const totalLabelsCount = categories.map(category => category.labels_count || 0).reduce((acc, val) => acc + val, 0);

    if (images === null || images.length === 0) return null;

    return (
        <Card className={clsx(classes.root, className)} variant="outlined">
            <CardContent>
                <Typography gutterBottom>Label images</Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    {totalLabelsCount > 0 ? 'Edit labels' : 'Start labeling'} with our labelisator tool. See the{' '}
                    <Link variant="body2" color="primary" component={RouterLink} to="/datasets/labeling">
                        dedicated section
                    </Link>{' '}
                    on documentation.
                </Typography>
            </CardContent>
            <CardActions style={{ justifyContent: 'flex-end' }}>
                <Button
                    color="primary"
                    onClick={() => goToHash(images[0].id, true)}
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
