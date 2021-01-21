import React, {FC} from 'react';
import {useHistory} from 'react-router-dom';
import {Avatar, IconButton} from '@material-ui/core';
import {AccountCircle} from '@material-ui/icons';
import {useUser} from 'hooks';

const Account: FC = () => {

    const history = useHistory();

    const {user} = useUser();

    return (
        <>
            {user.id
                ? <IconButton
                    edge='end'
                    color='inherit'
                >
                    <Avatar
                        src={user.avatar}
                        alt='User avatar'
                    />
                </IconButton>
                : <IconButton
                    edge='end'
                    color='inherit'
                    onClick={() => history.push('/login')}
                >
                    <AccountCircle fontSize='large'/>
                </IconButton>
            }
        </>
    )
};

export default Account;