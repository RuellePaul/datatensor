import React, {FC} from 'react';
import clsx from 'clsx';
import {Grid, makeStyles} from '@material-ui/core';
import {Dataset} from 'src/types/dataset';
import {User} from 'src/types/user';
import UserInfo from './UserInfo';
import OtherActions from './OtherActions';

interface DetailsProps {
    user: User;
    datasets: Dataset[];
    className?: string;
}

const useStyles = makeStyles(() => ({
    root: {}
}));

const Details: FC<DetailsProps> = ({
                                       user,
                                       datasets,
                                       className,
                                       ...rest
                                   }) => {
    const classes = useStyles();

    return (
        <Grid
            className={clsx(classes.root, className)}
            container
            spacing={3}
            {...rest}
        >
            <Grid
                item
                lg={4}
                md={6}
                xl={3}
                xs={12}
            >
                <UserInfo
                    user={user}
                    datasets={datasets}
                />
            </Grid>
            <Grid
                item
                lg={4}
                md={6}
                xl={3}
                xs={12}
            >

            </Grid>
            <Grid
                item
                lg={4}
                md={6}
                xl={3}
                xs={12}
            >

            </Grid>
            <Grid
                item
                lg={4}
                md={6}
                xl={3}
                xs={12}
            >
                <OtherActions/>
            </Grid>
        </Grid>
    );
};


export default Details;
