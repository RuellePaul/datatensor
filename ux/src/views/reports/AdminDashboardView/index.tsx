import React, {FC, useCallback, useEffect, useState} from 'react';
import {Button, Container, Grid, makeStyles} from '@material-ui/core';
import {useSnackbar} from 'notistack';
import Page from 'src/components/Page';
import {Theme} from 'src/theme';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import {User} from 'src/types/user';
import api from 'src/utils/api';
import Header from './Header';
import UsersOverTime from './UsersOverTime';
import {TimeRange} from 'src/types/timeRange'


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
        value: 'last_month',
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

    const {enqueueSnackbar} = useSnackbar();

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

    const [timeRange, setTimeRange] = useState<TimeRange>(timeRanges[2]);

    const handleGenerateCocoDataset = async () => {
        try {
            const response = await api.post('/v1/admin/generator/coco');

            if (isMountedRef.current) {
                enqueueSnackbar('Dataset COCO generated', {variant: 'info'});
            }
        } catch (error) {
            enqueueSnackbar('Something went wrong', {variant: 'warning'});
        }
    };

    return (
        <Page
            className={classes.root}
            title="Dashboard | Admin"
        >
            <Container maxWidth={false}>
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
                        lg={3}
                        xs={12}
                    >
                        <Button
                            variant='contained'
                            onClick={handleGenerateCocoDataset}
                        >
                            Generate COCO dataset
                        </Button>

                    </Grid>
                    <Grid
                        item
                        lg={9}
                        xs={12}
                    >
                        <UsersOverTime
                            timeRange={timeRange}
                            users={users}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};

export default AdminDashboardView;
