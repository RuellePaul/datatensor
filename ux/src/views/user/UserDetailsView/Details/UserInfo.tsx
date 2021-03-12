import React, {FC} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {Box, Card, CardHeader, Divider, makeStyles} from '@material-ui/core';
import {Theme} from 'src/theme';
import {Dataset} from 'src/types/dataset';

interface UserInfoProps {
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
            <Box
                p={1}
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
            >
                {JSON.stringify(datasets)}
            </Box>
        </Card>
    );
};

UserInfo.propTypes = {
    className: PropTypes.string,
    // @ts-ignore
    user: PropTypes.object.isRequired
};

export default UserInfo;
