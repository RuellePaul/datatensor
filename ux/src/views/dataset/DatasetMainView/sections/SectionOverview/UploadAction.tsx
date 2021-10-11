import React, {FC} from 'react';
import clsx from 'clsx';
import {Card, CardActions, CardContent, CardHeader, Typography} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';
import UploadButton from 'src/components/core/Images/UploadButton';

const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}));

interface UploadActionProps {
    className?: string;
}

const UploadAction: FC<UploadActionProps> = ({className}) => {
    const classes = useStyles();

    return (
        <Card className={clsx(classes.root, className)} variant="outlined">
            <CardHeader title="Upload" />
            <CardContent>
                <Typography gutterBottom>Upload images</Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    Lorem ipsum dolor
                </Typography>
            </CardContent>
            <CardActions style={{justifyContent: 'flex-end'}}>
                <UploadButton />
            </CardActions>
        </Card>
    );
};

export default UploadAction;
