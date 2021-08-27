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
    makeStyles,
    MenuItem,
    Theme,
    useTheme
} from '@material-ui/core';
import {Users as UsersIcon} from 'react-feather';
import GenericMoreButton from 'src/components/utils/GenericMoreButton';
import {User} from 'src/types/user';

interface UserScopesProps {
    className?: string;
    users: User[];
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

const UserScopes: FC<UserScopesProps> = ({className, users, ...rest}) => {

    const classes = useStyles();
    const theme = useTheme();

    const history = useHistory();

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
                            <ListItemText primary='View all users'/>
                        </MenuItem>
                    </GenericMoreButton>
                )}
                title='Scopes Over Time'
            />
            <Divider/>
            <CardContent className={classes.shrink}>
                <Chart
                    options={{
                        colors: [
                            theme.palette.success.main,
                            theme.palette.info.main,
                            theme.palette.warning.main,
                            theme.palette.error.main
                        ],
                        labels: [
                            'email',
                            'github',
                            'google',
                            'stackoverflow'
                        ],
                        legend: {
                            fontFamily: theme.typography.fontFamily,
                            labels: {
                                colors: theme.palette.text.secondary,
                            },
                            onItemClick: {
                                toggleDataSeries: false
                            },
                            onItemHover: {
                                highlightDataSeries: false
                            }
                        },
                        stroke: {
                            width: 1
                        }
                    }}
                    series={[
                        users.filter(user => user.scope === null).length,
                        users.filter(user => user.scope === 'github').length,
                        users.filter(user => user.scope === 'google').length,
                        users.filter(user => user.scope === 'stackoverflow').length,
                    ]}
                    type='donut'
                    height={350}
                />
            </CardContent>
        </Card>
    );
};

export default UserScopes;
