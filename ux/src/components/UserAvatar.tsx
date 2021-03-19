import React, {FC} from 'react';
import clsx from 'clsx';
import {Avatar, Badge, makeStyles} from '@material-ui/core';
import {User} from 'src/types/user';
import getInitials from 'src/utils/getInitials';
import {Theme} from 'src/theme';
import {GithubIcon, GoogleIcon, StackoverflowIcon} from 'src/views/auth/LoginView/OAuthLoginButton';

interface UserAvatarProps {
    className?: string;
    user: User;
}

const useStyles = makeStyles((theme: Theme) => ({
    badge: {
        '& .MuiBadge-badge': {
            width: '100%',
            height: '100%',
            padding: 0
        }
    },
    smallAvatar: {
        width: '45%',
        height: '45%',
        minWidth: 22,
        minHeight: 22,
        maxWidth: 35,
        maxHeight: 35,
        background: theme.palette.background.paper,
        opacity: 0.8,
        '& svg': {
            padding: 2,
            color: theme.palette.background.paper,
            fill: 'white',
            width: 'auto !important',
            height: 'auto !important'
        }
    },
    border: {
        border: `2px solid ${theme.palette.background.paper}`,
    }
}));


const UserAvatar: FC<UserAvatarProps> = ({
                                             className,
                                             user,
                                             ...rest
                                         }) => {

    const classes = useStyles();

    return (
        user.scope
            ? (
                <Badge
                    className={classes.badge}
                    overlap="circle"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    badgeContent={(
                        <Avatar
                            className={clsx(classes.smallAvatar, user.scope === 'github' && classes.border)}
                            alt={user.scope}
                        >
                            {user.scope === 'github' && <GithubIcon/>}
                            {user.scope === 'google' && <GoogleIcon/>}
                            {user.scope === 'stackoverflow' && <StackoverflowIcon/>}
                        </Avatar>
                    )}
                >
                    <Avatar
                        className={clsx(className)}
                        src={user.avatar}
                        alt="User"
                        {...rest}
                    >
                        {getInitials(user.name)}
                    </Avatar>
                </Badge>
            ) : (
                <Avatar
                    className={clsx(className)}
                    src={user.avatar}
                    alt="User"
                    {...rest}
                >
                    {getInitials(user.name)}
                </Avatar>
            )
    );
};

export default UserAvatar;
