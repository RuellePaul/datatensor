import React, {FC} from 'react';
import {Container, Grid, makeStyles} from '@material-ui/core';
import {Theme} from 'src/theme';
import Page from 'src/components/Page';
import Header from '../AdminDashboardView/Header';
import UsersOverTime from '../AdminDashboardView/UsersOverTime';
import Generator from '../AdminDashboardView/Generator';
import DTTasks from '../../../components/datatensor/Tasks';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const DashboardView: FC = () => {
    const classes = useStyles();

    return (
        <Page
            className={classes.root}
            title="Dashboard"
        >
            <Container maxWidth="lg">
                ...
            </Container>
        </Page>
    );
};

export default DashboardView;
