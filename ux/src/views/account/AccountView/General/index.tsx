import React, {FC} from 'react';
import clsx from 'clsx';
import {Grid} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import useAuth from 'src/hooks/useAuth';
import ProfileDetails from './ProfileDetails';
import GeneralSettings from './GeneralSettings';


interface GeneralProps {
    className?: string;
}

const useStyles = makeStyles(() => ({
    root: {}
}));

const General: FC<GeneralProps> = ({className, ...rest}) => {
    const classes = useStyles();
    const {user} = useAuth();

    return (
        <Grid className={clsx(classes.root, className)} container spacing={3} {...rest}>
            <Grid item lg={4} md={6} xl={3} xs={12}>
                <ProfileDetails user={user} />
            </Grid>
            <Grid item lg={8} md={6} xl={9} xs={12}>
                <GeneralSettings user={user} />
            </Grid>
        </Grid>
    );
};

export default General;
