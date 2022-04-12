import React, {FC} from 'react';
import clsx from 'clsx';
import {Box, Card, CardContent, Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import UserAvatar from 'src/components/UserAvatar';
import {Theme} from 'src/theme';
import {User} from 'src/types/user';

interface ProfileDetailsProps {
    className?: string;
    user: User;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    name: {
        marginTop: theme.spacing(1)
    },
    avatar: {
        height: 100,
        width: 100,
        marginBottom: theme.spacing(2)
    }
}));

const ProfileDetails: FC<ProfileDetailsProps> = ({className, user, ...rest}) => {
    const classes = useStyles();

    return (
        <Card className={clsx(classes.root, className)} {...rest}>
            <CardContent>
                <Box display="flex" alignItems="center" flexDirection="column" textAlign="center">
                    <UserAvatar className={classes.avatar} />
                    <Typography className={classes.name} color="textPrimary" gutterBottom variant="h3">
                        {user.name}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProfileDetails;
