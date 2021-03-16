import React, {FC, useCallback, useEffect, useState} from 'react';
import {Container, Grid, makeStyles} from '@material-ui/core';
import Page from 'src/components/Page';
import {Theme} from 'src/theme';
import Header from './Header';
import UsersOverTime from './UsersOverTime';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import {User} from '../../../types/user';
import api from '../../../utils/api';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const AdminDashboardView: FC = () => {
    const classes = useStyles();

    const isMountedRef = useIsMountedRef();
    const [users, setUsers] = useState<User[]>([]);

    const getUsers = useCallback(async () => {
        try {
            const response = await api.get<User[]>('/v1/admin/manage/users');

            if (isMountedRef.current) {
                setUsers(response.data);
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
            title="Dashboard"
        >
            <Container maxWidth={false}>
                <Header/>
                <Grid
                    container
                    spacing={3}
                >
                    <Grid
                        item
                        lg={3}
                        xs={12}
                    >

                    </Grid>
                    <Grid
                        item
                        lg={9}
                        xs={12}
                    >
                        <UsersOverTime
                            users={users}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};

export default AdminDashboardView;
