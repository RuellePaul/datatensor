import React, {FC} from 'react';
import clsx from 'clsx';
import {Grid, makeStyles} from '@material-ui/core';
import UserInfo from './UserInfo';
import OtherActions from './OtherActions';
import useUser from 'src/hooks/useUser';

interface DetailsProps {
    className?: string;
}

const useStyles = makeStyles(() => ({
    root: {}
}));

const Details: FC<DetailsProps> = ({
                                       className,
                                       ...rest
                                   }) => {
    const classes = useStyles();
    const {user} = useUser();

    return (
        <Grid
            className={clsx(classes.root, className)}
            container
            spacing={3}
            {...rest}
        >
            <Grid
                item
                md={6}
                xs={12}
            >
                <UserInfo
                    user={user}
                />
            </Grid>
            <Grid
                item
                md={6}
                xs={12}
            >
                <OtherActions/>
            </Grid>
        </Grid>
    );
};


export default Details;
