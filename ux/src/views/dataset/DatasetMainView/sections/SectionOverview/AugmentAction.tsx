import React, {FC, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Link,
    Typography
} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';
import {Close as CloseIcon, PublishOutlined as UploadIcon} from '@mui/icons-material';
import SectionAugmentation from 'src/views/dataset/DatasetMainView/sections/SectionAugmentation';

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
                    Since there are labeled images on this dataset, you can use image augmentation to get more. See the{' '}
                    <Link variant="body2" color="primary" component={RouterLink} to="/upload-images">
                        dedicated section
                    </Link>{' '}
                    on documentation.
                </Typography>
            </CardContent>
            <CardActions style={{justifyContent: 'flex-end'}}>
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<UploadIcon />}
                    onClick={handleOpenAugmentation}
                >
                    Augment images
                </Button>
            </CardActions>

            <Dialog open={open} onClose={handleCloseAugmentation} fullWidth maxWidth="lg">
                <DialogTitle>
                    Augment images
                    <IconButton className={classes.close} onClick={handleCloseAugmentation}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <SectionAugmentation />
                </DialogContent>
            </Dialog>
        </Card>
    );
};

export default AugmentAction;
