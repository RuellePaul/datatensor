import React, {FC, useCallback, useEffect, useState} from 'react';
import {Container, Grid} from '@mui/material';
import {makeStyles} from '@mui/styles';
import Page from 'src/components/Page';
import {Theme} from 'src/theme';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import {User} from 'src/types/user';
import api from 'src/utils/api';
import Header from './Header';
import Actions from './Actions';
import Generator from './Generator';
import UsersOverTime from 'src/components/charts/UsersOverTime';
import UserScopes from 'src/components/charts/UserScopes';
import {TimeRange} from 'src/types/timeRange';

const timeRanges: TimeRange[] = [
    {
        value: 'last_hour',
        text: 'Last hour'
    },
    {
        value: 'last_day',
        text: 'Last day'
    },
    {
        value: 'last_week',
        text: 'Last week'
    },
    {
        value: 'last_month',
        text: 'Last month'
    },
    {
        value: 'last_year',
        text: 'Last year'
    }
];

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
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
            const response = await api.get<{users: User[]}>('/users/');

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

    const [timeRange, setTimeRange] = useState<TimeRange>(timeRanges[2]);

    return (
        <Page className={classes.root} title="Dashboard | Admin">
            <Container component="section" maxWidth="lg">
                <Header timeRange={timeRange} setTimeRange={setTimeRange} timeRanges={timeRanges} />
                <Grid container spacing={3}>
                    <Grid item lg={4} xs={12}>
                        <Actions />
                    </Grid>
                    <Grid item md={8} xs={12}>
                        <Generator />
                    </Grid>
                    <Grid item md={7} xs={12}>
                        <UsersOverTime users={users} timeRange={timeRange} />
                    </Grid>
                    <Grid item md={5} xs={12}>
                        <UserScopes users={users} />
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};

export default AdminDashboardView;
