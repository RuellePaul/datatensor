import React, {FC, useCallback, useEffect, useState} from 'react';
import {Box, Container, makeStyles} from '@material-ui/core';
import api from 'src/utils/api';
import {Theme} from 'src/theme';
import Page from 'src/components/Page';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import {User} from 'src/types/user';
import Header from './Header';
import Results from './Results';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const UserListView: FC = () => {
    const classes = useStyles();
    const isMountedRef = useIsMountedRef();
    const [users, setUsers] = useState<User[]>([]);

    const getUsers = useCallback(async () => {
        try {
            const response = await api.get<{ users: User[] }>('/users/');

            if (isMountedRef.current) {
                setUsers(response.data.users);
            }
        } catch (err) {
            console.error(err);
        }
    }, [isMountedRef]);

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    return (
        <Page
            className={classes.root}
            title="Users | Admin"
        >
            <Container component='section' maxWidth="lg">
                <Header/>
                <Box mt={3}>
                    <Results
                        users={users}
                        setUsers={setUsers}
                    />
                </Box>
            </Container>
        </Page>
    );
};

export default UserListView;
