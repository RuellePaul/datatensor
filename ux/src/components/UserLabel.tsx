import React, {FC} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import {Box, Link, makeStyles} from '@material-ui/core';
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
    }
}));


const UserLabel: FC<UserLabelProps> = ({
                                           user,
                                           className,
                                       }) => {

    const classes = useStyles();

    if (!user)
        return null;

    return (
        <div className={clsx(classes.root, className)}>
            <Box mr={1}>
                <UserAvatar
                    user={user}
                    style={{width: 30, height: 30}}
                />

            </Box>

            <Link
                color='inherit'
                component={RouterLink}
                onClick={event => event.stopPropagation()}
                to={`/app/admin/manage/users/${user.id}/details`}
                variant='h6'
            >
                {user.name}
            </Link>
        </div>
    );
};

export default UserLabel;
