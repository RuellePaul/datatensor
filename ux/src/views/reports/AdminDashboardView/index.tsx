import React, {FC, useCallback, useEffect, useState} from 'react';
import {Container, Grid, makeStyles} from '@material-ui/core';
import Page from 'src/components/Page';
import {Theme} from 'src/theme';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import {User} from 'src/types/user';
import api from 'src/utils/api';
import Header from './Header';
import Generator from './Generator';
import TasksOverTime from 'src/components/charts/TasksOverTime';
import UsersOverTime from 'src/components/charts/UsersOverTime';
import DTTasks from 'src/components/datatensor/Tasks';
import {TimeRange} from 'src/types/timeRange'
import useTasks from 'src/hooks/useTasks';


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

    const {tasks} = useTasks();

    const getUsers = useCallback(async () => {
        try {
            const response = await api.get<{ users: User[] }>('/users');

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
        <Page
            className={classes.root}
            title="Dashboard | Admin"
        >
            <Container maxWidth="lg">
                <Header
                    timeRange={timeRange}
                    setTimeRange={setTimeRange}
                    timeRanges={timeRanges}
                />
                <Grid
                    container
                    spacing={3}
                >
                    <Grid
                        item
                        lg={7}
                        xs={12}
                    >
                        <TasksOverTime
                            tasks={tasks}
                            timeRange={timeRange}
                        />
                    </Grid>
                    <Grid
                        item
                        lg={5}
                        xs={12}
                    >
                        <Generator/>
                    </Grid>
                    <Grid
                        item
                        lg={3}
                        xs={12}
                    >

                    </Grid>
                    <Grid
                        item
                        lg={8}
                        xs={12}
                    >
                        <DTTasks/>
                    </Grid>
                    <Grid
                        item
                        lg={7}
                        xs={12}
                    >
                        <UsersOverTime
                            users={users}
                            timeRange={timeRange}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};

export default AdminDashboardView;
