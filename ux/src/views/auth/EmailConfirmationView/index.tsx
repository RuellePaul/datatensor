import React, {FC, useEffect} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {Box, Button, Container, Typography} from '@mui/material';
import {makeStyles} from '@mui/styles';
import Page from 'src/components/Page';
import SplashScreen from 'src/components/screens/SplashScreen';
import useAuth from 'src/hooks/useAuth';
import parseQueryArgs from 'src/utils/parseQueryArgs';
import {Theme} from 'src/theme';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
    }
}));

const EmailConfirmationView: FC = () => {
    const classes = useStyles();

    const {confirmEmail} = useAuth();
    const activation_code = parseQueryArgs('activation_code');

    useEffect(() => {
        activation_code && confirmEmail(activation_code);
    }, [confirmEmail, activation_code]);

    return (
        <>
            {activation_code ? (
                <SplashScreen />
            ) : (
                <Page className={classes.root} title="Confirmation">
                    <Container component="section" maxWidth="lg">
                        <Typography
                            align="center"
                            variant="h2"
                            color="textPrimary"
                        >
                            Confirm your email
                        </Typography>
                        <Typography
                            align="center"
                            variant="subtitle2"
                            color="textSecondary"
                        >
                            Please confirm your email to access Datatensor App.
                        </Typography>
                        <Box mt={6} display="flex" justifyContent="center">
                            <Button
                                color="primary"
                                component={RouterLink}
                                to="/"
                                variant="outlined"
                            >
                                Back to home
                            </Button>
                        </Box>
                    </Container>
                </Page>
            )}
        </>
    );
};

export default EmailConfirmationView;
