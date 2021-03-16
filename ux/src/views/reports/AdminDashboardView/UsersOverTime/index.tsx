import React, {FC} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {Box, Card, CardContent, CardHeader, Divider, makeStyles} from '@material-ui/core';
import GenericMoreButton from 'src/components/GenericMoreButton';
import Chart from './Chart';
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

const formatDDArray = (size) => Array.apply(null, Array(size)).map((_, i) => i < 9 ? `0${i + 1}` : `${i + 1}`);

const UsersOverTime: FC<PerformanceOverTimeProps> = ({className, users, timeRange, ...rest}) => {
    const classes = useStyles();

    const performance = {
        today: {
            data: formatDDArray(new Date().getHours())
                .map((hour, index) => (
                    users
                        .filter(user => moment(user.created_at).isBetween(
                            moment(new Date()).subtract(index + 1, 'hours'),
                            moment(new Date()).subtract(index, 'hours'),
                        ))
                        .length
                )).reverse(),
            labels: formatDDArray(new Date().getHours()).map(hour => `${hour}h`)
        },
        yesterday: {
            data: formatDDArray(24)
                .map((hour, index) => (
                    users
                        .filter(user => moment(user.created_at).isBetween(
                            moment(new Date()).subtract(1, 'days').subtract(index + 1, 'hours'),
                            moment(new Date()).subtract(1, 'days').subtract(index, 'hours'),
                        ))
                        .length
                )).reverse(),
            labels: formatDDArray(24).map(hour => `${hour}h`)
        },
        this_month: {
            data: formatDDArray(new Date().getDate())
                .map((day, index) => (
                    users
                        .filter(user => moment(user.created_at).isBetween(
                            moment(new Date()).subtract(index + 0.5, 'days'),
                            moment(new Date()).subtract(index - 0.5, 'days'),
                        ))
                        .length
                )).reverse(),
            labels: formatDDArray(new Date().getDate())
        },
        this_year: {
            data: formatDDArray(12)
                .map((month, index) => (
                    users
                        .filter(user => moment(user.created_at).isBetween(
                            moment(`01/${month}/${new Date().getFullYear()}`, "DD/MM/YYYY"),
                            moment(`31/${month}/${new Date().getFullYear()}`, "DD/MM/YYYY")
                        ))
                        .length
                )),
            labels: formatDDArray(12).map(month => moment(`01/${month}/${new Date().getFullYear()}`, "DD/MM/YYYY").format('MMMM'))
        }
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
                        <Chart
                            className={classes.chart}
                            data={performance[timeRange.value].data}
                            labels={performance[timeRange.value].labels}
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
