import React, {FC} from 'react';
import {useHistory} from 'react-router';
import Chart from 'react-apexcharts';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
    Card,
    CardContent,
    CardHeader,
    Divider,
    ListItemIcon,
    ListItemText,
    makeStyles,
    MenuItem,
    Theme,
    useTheme
} from '@material-ui/core';
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
        [theme.breakpoints.down('xs')]: {
            paddingLeft: 0,
            paddingRight: 0
        }
    }
}));

const buildArray = (size: number) => Array.apply(null, Array(size)).map((_, i) => i).reverse();

const UsersOverTime: FC<UsersOverTimeProps> = ({className, users, timeRange, ...rest}) => {

    const classes = useStyles();
    const theme = useTheme();

    const history = useHistory();

    const generateChartData = (size: number, interval: string, format: string) => (
        {
            data: buildArray(size + 1)
                .map(index => (
                    users
                        .filter(user => moment(user.created_at).isBetween(
                            moment(new Date()).subtract(index + 1, interval),
                            moment(new Date()).subtract(index, interval),
                        ))
                        .length
                )),
            labels: buildArray(size + 1).map(index => moment(new Date()).subtract(index, interval).format(format))
        }
    );

    const usersOverTime = {
        last_hour: generateChartData(60, 'minutes', 'HH:mm'),
        last_day: generateChartData(24, 'hours', 'HH:00'),
        last_week: generateChartData(7, 'days', 'DD MMM'),
        last_month: generateChartData(31, 'days', 'DD MMM'),
        last_year: generateChartData(12, 'months', 'MMM'),
    };

    return (
        <Card
            className={clsx(classes.root, className)}
            {...rest}
        >
            <CardHeader
                action={(
                    <GenericMoreButton>
                        <MenuItem onClick={() => history.push('/app/admin/manage/users')}>
                            <ListItemIcon>
                                <UsersIcon/>
                            </ListItemIcon>
                            <ListItemText primary="View all users"/>
                        </MenuItem>
                    </GenericMoreButton>
                )}
                title="Users Over Time"
            />
            <Divider/>
            <CardContent className={classes.shrink}>
                <Chart
                    options={{
                        colors: [theme.palette.primary.main],
                        chart: {
                            toolbar: {
                                show: false
                            }
                        },
                        stroke: {
                            show: true,
                            curve: 'smooth',
                            lineCap: 'butt',
                            colors: undefined,
                            width: 2,
                            dashArray: 0,
                        },
                        tooltip: {
                            enabled: false
                        },
                        xaxis: {
                            categories: usersOverTime[timeRange.value].labels
                        }
                    }}
                    series={[{
                        name: 'series-1',
                        data: usersOverTime[timeRange.value].data
                    }]}
                    type='line'
                    height={350}
                />
            </CardContent>
        </Card>
    );
};

UsersOverTime.propTypes = {
    className: PropTypes.string
};

export default UsersOverTime;
