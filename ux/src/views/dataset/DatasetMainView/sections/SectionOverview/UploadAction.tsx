import React, {FC} from 'react';
import clsx from 'clsx';
import {Card, CardActions, CardContent, CardHeader, Link, Typography} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';
import UploadButton from 'src/components/core/Images/UploadButton';
import {Link as RouterLink} from 'react-router-dom';


const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}));

interface UploadActionProps {
    className?: string;
}

const UploadAction: FC<UploadActionProps> = ({ className }) => {
    const classes = useStyles();

    return (
        <Card className={clsx(classes.root, className)} variant="outlined">
            <CardHeader title="Upload" />
            <CardContent>
                <Typography gutterBottom>Add images</Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    A dataset should have enough images to train a computer vision AI model. See the{' '}
                    <Link variant="body2" color="primary" component={RouterLink} to="/docs">
                        dedicated section
                    </Link>{' '}
                    on documentation.
                </Typography>
            </CardContent>
            <CardActions style={{ justifyContent: 'flex-end' }}>
                <UploadButton />
            </CardActions>
        </Card>
    );
};

export default UploadAction;
