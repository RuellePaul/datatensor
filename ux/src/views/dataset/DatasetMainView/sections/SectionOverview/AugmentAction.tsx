import React, {FC, useState} from 'react';
import clsx from 'clsx';
import {Button, Card, CardActions, CardContent, Link, Typography} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';
import {DynamicFeedOutlined as AugmentationIcon} from '@mui/icons-material';
import Augmentor from 'src/components/core/Augmentor';

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    close: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    }
}));

interface AugmentActionProps {
    className?: string;
}

const AugmentAction: FC<AugmentActionProps> = ({className}) => {
    const classes = useStyles();

    const [open, setOpen] = useState<boolean>(false);

    const handleOpenAugmentation = () => setOpen(true);
    const handleCloseAugmentation = () => setOpen(false);

    return (
        <Card className={clsx(classes.root, className)} variant="outlined">
            <CardContent>
                <Typography gutterBottom>Augment images</Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    Use dataset augmentation tool to get more images.{' '}
                    <Link
                        variant="body2"
                        color="primary"
                        onClick={() => window.open('/docs/datasets/augmentation', '_blank')}
                    >
                        Learn more
                    </Link>
                </Typography>
            </CardContent>
            <CardActions style={{justifyContent: 'flex-end'}}>
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<AugmentationIcon />}
                    onClick={handleOpenAugmentation}
                >
                    Augment images
                </Button>
            </CardActions>

            <Augmentor open={open} handleClose={handleCloseAugmentation} />
        </Card>
    );
};

export default AugmentAction;
