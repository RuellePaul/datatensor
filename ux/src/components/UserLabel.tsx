import React, {FC} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import {Box, Link} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {User} from 'src/types/user';
import {Theme} from 'src/theme';
import UserAvatar from 'src/components/UserAvatar';

interface UserLabelProps {
    className?: string;
    user: User;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center'
    },
    link: {
        display: 'block'
    }
}));

const UserLabel: FC<UserLabelProps> = ({children, user, className}) => {
    const classes = useStyles();

    if (!user) return null;

    return (
        <div className={clsx(classes.root, className)}>
            <Box mr={1}>
                <UserAvatar user={user} style={{width: 30, height: 30}} />
            </Box>

            <div>
                <Link
                    className={classes.link}
                    color="inherit"
                    component={RouterLink}
                    onClick={event => event.stopPropagation()}
                    to={`/users/${user.id}`}
                    variant="h6"
                >
                    {user.name}
                </Link>

                {children}
            </div>
        </div>
    );
};

export default UserLabel;
