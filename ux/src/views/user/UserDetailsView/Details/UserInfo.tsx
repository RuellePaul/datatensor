import React, {FC} from 'react';
import clsx from 'clsx';
import {Box, Button, Card, CardHeader, Divider, Table, TableBody, TableCell, TableRow, Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {LockOutlined} from '@mui/icons-material';
import {Theme} from 'src/theme';
import {User} from 'src/types/user';
import FancyLabel from 'src/components/FancyLabel';


interface UserInfoProps {
    user: User;
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    fontWeightMedium: {
        fontWeight: theme.typography.fontWeightMedium
    }
}));

const UserInfo: FC<UserInfoProps> = ({user, className, ...rest}) => {
    const classes = useStyles();

    return (
        <Card className={clsx(classes.root, className)} {...rest}>
            <CardHeader title="User info" />
            <Divider />
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell className={classes.fontWeightMedium}>Name</TableCell>
                        <TableCell>
                            <Typography variant="body2" color="textSecondary">
                                {user.name}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={classes.fontWeightMedium}>Email</TableCell>
                        <TableCell>
                            <Typography variant="body2" color="textSecondary">
                                {user.email}
                            </Typography>
                            <FancyLabel color={user.is_verified ? 'success' : 'error'}>
                                {user.is_verified ? 'Email verified' : 'Email not verified'}
                            </FancyLabel>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={classes.fontWeightMedium}>Phone</TableCell>
                        <TableCell>
                            <Typography variant="body2" color="textSecondary">
                                {user.phone}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={classes.fontWeightMedium}>Country</TableCell>
                        <TableCell>
                            <Typography variant="body2" color="textSecondary">
                                {user.country}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={classes.fontWeightMedium}>State/Region</TableCell>
                        <TableCell>
                            <Typography variant="body2" color="textSecondary">
                                {user.state}
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Box p={1} display="flex" flexDirection="column" alignItems="flex-start">
                <Button startIcon={<LockOutlined />}>Reset &amp; Send Password</Button>
            </Box>
        </Card>
    );
};

export default UserInfo;
