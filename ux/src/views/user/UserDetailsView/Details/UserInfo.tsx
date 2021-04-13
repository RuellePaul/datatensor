import React, {FC} from 'react';
import clsx from 'clsx';
import {
    Box,
    Button,
    Card,
    CardHeader,
    Divider,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography
} from '@material-ui/core';
import {LockOutlined} from '@material-ui/icons';
import {Theme} from 'src/theme';
import {Dataset} from 'src/types/dataset';
import {User} from 'src/types/user';
import Label from 'src/components/Label';

interface UserInfoProps {
    user: User;
    datasets: Dataset[];
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    fontWeightMedium: {
        fontWeight: theme.typography.fontWeightMedium
    }
}));

const UserInfo: FC<UserInfoProps> = ({
                                         user,
                                         datasets,
                                         className,
                                         ...rest
                                     }) => {
    const classes = useStyles();

    return (
        <Card
            className={clsx(classes.root, className)}
            {...rest}
        >
            <CardHeader title="User info"/>
            <Divider/>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell className={classes.fontWeightMedium}>
                            Name
                        </TableCell>
                        <TableCell>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                            >
                                {user.name}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={classes.fontWeightMedium}>
                            Email
                        </TableCell>
                        <TableCell>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                            >
                                {user.email}
                            </Typography>
                            <Label color={user.is_verified ? 'success' : 'error'}>
                                {user.is_verified ? 'Email verified' : 'Email not verified'}
                            </Label>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={classes.fontWeightMedium}>
                            Phone
                        </TableCell>
                        <TableCell>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                            >
                                {user.phone}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={classes.fontWeightMedium}>
                            Country
                        </TableCell>
                        <TableCell>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                            >
                                {user.country}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={classes.fontWeightMedium}>
                            State/Region
                        </TableCell>
                        <TableCell>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                            >
                                {user.state}
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Box
                p={1}
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
            >
                <Button startIcon={<LockOutlined/>}>
                    Reset &amp; Send Password
                </Button>
            </Box>
        </Card>
    );
};


export default UserInfo;
