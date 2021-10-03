import React, {FC} from 'react';
import {useParams} from 'react-router';
import {useHistory} from 'react-router-dom';
import clsx from 'clsx';
import {Box, Button, Card, CardContent, CardHeader, Divider, Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import GetAppIcon from '@mui/icons-material/GetApp';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import {Theme} from 'src/theme';
import api from 'src/utils/api';

interface OtherActionsProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    deleteAction: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.error.main,
        '&:hover': {
            backgroundColor: theme.palette.error.dark
        }
    }
}));

const OtherActions: FC<OtherActionsProps> = ({className, ...rest}) => {
    const classes = useStyles();

    const history = useHistory();
    const {user_id} = useParams();

    const handleDeleteUser = async () => {
        await api.delete(`/users/${user_id}`);
        history.push('/app/admin/users');
    };

    return (
        <Card className={clsx(classes.root, className)} {...rest}>
            <CardHeader title="Other actions" />
            <Divider />
            <CardContent>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                >
                    <Button startIcon={<NotInterestedIcon />}>
                        Close Account
                    </Button>
                    <Button startIcon={<GetAppIcon />}>Export Data</Button>
                </Box>
                <Box mt={1} mb={2}>
                    <Typography variant="body2" color="textSecondary">
                        Remove this user’s data if he requested that, if not
                        please be aware that what has been deleted can never
                        brough back
                    </Typography>
                </Box>
                <Button
                    className={classes.deleteAction}
                    startIcon={<DeleteIcon />}
                    onClick={handleDeleteUser}
                >
                    Delete Account
                </Button>
            </CardContent>
        </Card>
    );
};

export default OtherActions;
