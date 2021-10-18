import React, {FC, useEffect} from 'react';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import {useSnackbar} from 'notistack';
import {Box, Card, CardContent, Container, Divider, Link, Typography} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';
import Page from 'src/components/Page';
import Logo from 'src/components/utils/Logo';
import JWTLogin from './JWTLogin';
import OAuthLoginButton from './OAuthLoginButton';
import parseQueryArgs from 'src/utils/parseQueryArgs';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
    },
    cardContainer: {
        paddingBottom: 80,
        paddingTop: 80
    },
    cardContent: {
        padding: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        minHeight: 400,
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(3, 2)
        }
    },
    auth0buttons: {
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column'
        }
    }
}));

const LoginView: FC = () => {
    const classes = useStyles();
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        if (parseQueryArgs('expired')) {
            enqueueSnackbar(`Session expired.`, {variant: 'warning'});
            history.replace('/login');
        }

        // eslint-disable-next-line
    }, []);

    return (
        <Page className={classes.root} title="Login">
            <Container component="section" className={classes.cardContainer} maxWidth="sm">
                <Box mb={8} display="flex" justifyContent="center">
                    <RouterLink to="/">
                        <Logo />
                    </RouterLink>
                </Box>
                <Card>
                    <CardContent className={classes.cardContent}>
                        <Box alignItems="center" display="flex" justifyContent="space-between" mb={3}>
                            <div>
                                <Typography color="textPrimary" gutterBottom variant="h2">
                                    Sign in
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Sign in on Datatensor App
                                </Typography>
                            </div>
                        </Box>

                        <Box display="flex" className={classes.auth0buttons} mt={2}>
                            <OAuthLoginButton scope="github" />
                            <OAuthLoginButton scope="google" />
                            <OAuthLoginButton scope="stackoverflow" />
                        </Box>
                        <Box mt={3}>
                            <Divider />
                        </Box>
                        <Box flexGrow={1} mt={3}>
                            <JWTLogin />
                        </Box>
                        <Box my={3}>
                            <Divider />
                        </Box>
                        <Link component={RouterLink} to="/register" variant="body2" color="textSecondary">
                            Create new account
                        </Link>
                    </CardContent>
                </Card>
            </Container>
        </Page>
    );
};

export default LoginView;
