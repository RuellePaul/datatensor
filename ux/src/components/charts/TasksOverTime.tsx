import React, {FC} from 'react';
import Chart from 'react-apexcharts';
import clsx from 'clsx';
import {Card, CardContent, CardHeader, Divider, makeStyles, Theme, useTheme} from '@material-ui/core';
import {Task} from 'src/types/task';
import moment from 'moment';
import {TimeRange} from 'src/types/timeRange';

interface TasksOverTimeProps {
    className?: string;
    tasks: Task[];
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

const TasksOverTime: FC<TasksOverTimeProps> = ({className, tasks, timeRange, ...rest}) => {

    const classes = useStyles();
    const theme = useTheme();

    const generateChartData = (size: number, interval: string, format: string, status: string) => (
        {
            data: buildArray(size + 1)
                .map(index => (
                    tasks
                        .filter(task => task.status === status)
                        .filter(task => moment(task.created_at).isBetween(
                            moment(new Date()).subtract(index + 1, interval),
                            moment(new Date()).subtract(index, interval),
                        ))
                        .length
                )),
            labels: buildArray(size + 1).map(index => moment(new Date()).subtract(index, interval).format(format))
        }
    );

    const tasksOverTime = {
        last_hour: {
            pending: generateChartData(60, 'minutes', 'HH:mm', 'pending'),
            active: generateChartData(60, 'minutes', 'HH:mm', 'active'),
            success: generateChartData(60, 'minutes', 'HH:mm', 'success'),
            failed: generateChartData(60, 'minutes', 'HH:mm', 'failed'),
        },
        last_day: {
            pending: generateChartData(24, 'hours', 'HH:00', 'pending'),
            active: generateChartData(24, 'hours', 'HH:00', 'active'),
            success: generateChartData(24, 'hours', 'HH:00', 'success'),
            failed: generateChartData(24, 'hours', 'HH:00', 'failed'),
        },
        last_week: {
            pending: generateChartData(7, 'days', 'DD MMM', 'pending'),
            active: generateChartData(7, 'days', 'DD MMM', 'active'),
            success: generateChartData(7, 'days', 'DD MMM', 'success'),
            failed: generateChartData(7, 'days', 'DD MMM', 'failed'),
        },
        last_month: {
            pending: generateChartData(31, 'days', 'DD MMM', 'pending'),
            active: generateChartData(31, 'days', 'DD MMM', 'active'),
            success: generateChartData(31, 'days', 'DD MMM', 'success'),
            failed: generateChartData(31, 'days', 'DD MMM', 'failed'),
        },
        last_year: {
            pending: generateChartData(12, 'months', 'MMM', 'pending'),
            active: generateChartData(12, 'months', 'MMM', 'active'),
            success: generateChartData(12, 'months', 'MMM', 'success'),
            failed: generateChartData(12, 'months', 'MMM', 'failed'),
        }
    };

    return (
        <Card
            className={clsx(classes.root, className)}
            {...rest}
        >
            <CardHeader
                title="Tasks over time"
            />
            <Divider/>
            <CardContent className={classes.shrink}>
                <Chart
                    options={{
                        colors: [
                            theme.palette.divider,
                            theme.palette.info.main,
                            theme.palette.success.main,
                            theme.palette.error.main
                        ],
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
                        tooltip: {
                            enabled: true,
                            enabledOnSeries: undefined,
                            theme: theme.palette.type,
                            shared: true,
                            intersect: false,
                            onDatasetHover: {
                                highlightDataSeries: true,
                            }
                        },
                        xaxis: {
                            categories: tasksOverTime[timeRange.value].success.labels
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
                            name: 'Pending',
                            data: tasksOverTime[timeRange.value].pending.data
                        },
                        {
                            name: 'Active',
                            data: tasksOverTime[timeRange.value].active.data
                        },
                        {
                            name: 'Completed',
                            data: tasksOverTime[timeRange.value].success.data
                        },
                        {
                            name: 'Failed',
                            data: tasksOverTime[timeRange.value].failed.data
                        },
                    ]}
                    type='bar'
                    height={350}
                />
            </CardContent>
        </Card>
    );
};

export default TasksOverTime;
