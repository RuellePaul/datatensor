import React, {FC} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {Box, Card, CardContent, CardHeader, Divider, makeStyles} from '@material-ui/core';
import GenericMoreButton from 'src/components/GenericMoreButton';
import Chart from './Chart';
import {User} from 'src/types/user';
import moment from 'moment';

interface PerformanceOverTimeProps {
    className?: string;
    users: User[];
}

const useStyles = makeStyles(() => ({
    root: {},
    chart: {
        height: '100%'
    }
}));

const UsersOverTime: FC<PerformanceOverTimeProps> = ({className, users, ...rest}) => {
    const classes = useStyles();

    const performance = {
        thisWeek: {
            data: [],
            labels: []
        },
        thisMonth: {
            data: [],
            labels: []
        },
        thisYear: {
            data: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
                .map(month => (
                    users
                        .filter(user => moment(user.created_at).isBetween(
                            moment(`01/${month}/2021`, "DD/MM/YYYY"),
                            moment(`31/${month}/2021`, "DD/MM/YYYY")
                        ))
                        .length
                )),
            labels: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ]
        }
    };

    console.log(

    );

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
                            data={performance.thisYear.data}
                            labels={performance.thisYear.labels}
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
