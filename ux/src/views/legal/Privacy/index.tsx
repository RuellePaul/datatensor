import React, {FC} from 'react';
import {Alert, AlertTitle, Container, Typography} from '@mui/material';
import {makeStyles} from '@mui/styles';
import Page from 'src/components/Page';
import {Theme} from 'src/theme';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh',
        paddingTop: 64
    }
}));

const PrivacyView: FC = () => {
    const classes = useStyles();

    return (
        <Page className={classes.root} title="Privacy">
            <Container maxWidth="md" sx={{py: 4}}>
                <Typography variant="h1" color="textPrimary" gutterBottom>
                    Privacy
                </Typography>

                <Alert severity="warning">
                    <AlertTitle>Incoming</AlertTitle>
                    This page will be coming soon.
                </Alert>
            </Container>
        </Page>
    );
};

export default PrivacyView;
