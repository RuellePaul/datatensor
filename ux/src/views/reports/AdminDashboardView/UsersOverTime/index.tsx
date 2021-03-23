import React, {FC} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {Box, Card, CardContent, CardHeader, Divider, makeStyles} from '@material-ui/core';
import GenericMoreButton from 'src/components/utils/GenericMoreButton';
import ComposedChart from './ComposedChart';
import {User} from 'src/types/user';
import moment from 'moment';
import {TimeRange} from 'src/types/timeRange';

interface PerformanceOverTimeProps {
    className?: string;
    users: User[];
    timeRange: TimeRange;
}

const useStyles = makeStyles(() => ({
    root: {},
    chart: {
        height: '100%'
    }
}));

const buildArray = (size: number) => Array.apply(null, Array(size)).map((_, i) => i).reverse();

const UsersOverTime: FC<PerformanceOverTimeProps> = ({className, users, timeRange, ...rest}) => {

    const classes = useStyles();

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
                action={<GenericMoreButton/>}
                title="Users Over Time"
            />
            <Divider/>
            <CardContent>
                <PerfectScrollbar>
                    <Box
                        height={375}
                        minWidth={500}
                    >
                        <ComposedChart
                            className={classes.chart}
                            data={usersOverTime[timeRange.value].data}
                            labels={usersOverTime[timeRange.value].labels}
                        />
                    </Box>
                </PerfectScrollbar>
            </CardContent>
        </Card>
    );
};

UsersOverTime.propTypes = {
    className: PropTypes.string
};

export default UsersOverTime;
