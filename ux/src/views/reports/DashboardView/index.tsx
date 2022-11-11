import React, {FC} from 'react';
import {Container} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';
import Page from 'src/components/Page';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const DashboardView: FC = () => {
    const classes = useStyles();

    return (
        <Page className={classes.root} title="Dashboard">
            <Container component="section" maxWidth="lg">
                ...
            </Container>
        </Page>
    );
};

export default DashboardView;
