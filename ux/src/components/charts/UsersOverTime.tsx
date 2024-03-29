import React, {FC} from 'react';
import {useHistory} from 'react-router';
import Chart from 'react-apexcharts';
import clsx from 'clsx';
import {
    Card,
    CardContent,
    CardHeader,
    Divider,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Theme,
    useTheme
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {Users as UsersIcon} from 'react-feather';
import GenericMoreButton from 'src/components/utils/GenericMoreButton';
import {User} from 'src/types/user';
import moment from 'moment';
import {TimeRange} from 'src/types/timeRange';


interface UsersOverTimeProps {
    className?: string;
    users: User[];
    timeRange: TimeRange;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        background: 'transparent',
        boxShadow: 'none',
        border: `solid 1px ${theme.palette.divider}`
    },
    shrink: {
        paddingBottom: 0,
        [theme.breakpoints.down('sm')]: {
            paddingLeft: 0,
            paddingRight: 0
        }
    }
}));

const buildArray = (size: number) =>
    Array.apply(null, Array(size))
        .map((_, i) => i)
        .reverse();

const UsersOverTime: FC<UsersOverTimeProps> = ({className, users, timeRange, ...rest}) => {
    const classes = useStyles();
    const theme = useTheme();

    const history = useHistory();

    const generateChartData = (size: number, interval: string, format: string) => ({
        data: buildArray(size + 1).map(
            index =>
                users.filter(user =>
                    moment(user.created_at).isBetween(
                        moment(new Date()).subtract(index + 1, interval),
                        moment(new Date()).subtract(index, interval)
                    )
                ).length
        ),
        labels: buildArray(size + 1).map(index =>
            moment(new Date())
                .subtract(index, interval)
                .format(format)
        )
    });

    const usersOverTime = {
        last_hour: generateChartData(60, 'minutes', 'HH:mm'),
        last_day: generateChartData(24, 'hours', 'HH:00'),
        last_week: generateChartData(7, 'days', 'DD MMM'),
        last_month: generateChartData(31, 'days', 'DD MMM'),
        last_year: generateChartData(12, 'months', 'MMM')
    };

    return (
        <Card className={clsx(classes.root, className)} {...rest}>
            <CardHeader
                action={
                    <GenericMoreButton>
                        <MenuItem onClick={() => history.push('/app/users')}>
                            <ListItemIcon>
                                <UsersIcon />
                            </ListItemIcon>
                            <ListItemText primary="View all users" />
                        </MenuItem>
                    </GenericMoreButton>
                }
                title="Users Over Time"
            />
            <Divider />
            <CardContent className={classes.shrink}>
                <Chart
                    options={{
                        colors: [theme.palette.primary.main],
                        chart: {
                            toolbar: {
                                show: false
                            }
                        },
                        dataLabels: {
                            enabled: false
                        },
                        grid: {
                            borderColor: theme.palette.divider
                        },
                        stroke: {
                            show: true,
                            curve: 'smooth',
                            lineCap: 'butt',
                            colors: undefined,
                            width: 2,
                            dashArray: 0
                        },
                        tooltip: {
                            enabled: true,
                            enabledOnSeries: undefined,
                            theme: theme.palette.mode,
                            shared: true,
                            intersect: false,
                            followCursor: true,
                            onDatasetHover: {
                                highlightDataSeries: true
                            }
                        },
                        xaxis: {
                            categories: usersOverTime[timeRange.value].labels
                        },
                        yaxis: [
                            {
                                labels: {
                                    formatter: value => value.toFixed(0)
                                }
                            }
                        ]
                    }}
                    series={[
                        {
                            name: 'Users',
                            data: usersOverTime[timeRange.value].data.reduce(
                                (a, x, i) => [...a, x + (a[i - 1] || 0)],
                                []
                            )
                        }
                    ]}
                    type="area"
                    height={350}
                />
            </CardContent>
        </Card>
    );
};

export default UsersOverTime;
