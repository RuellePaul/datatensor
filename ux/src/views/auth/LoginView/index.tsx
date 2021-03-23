import React, {FC} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {Box, Card, CardContent, Container, Divider, Link, makeStyles, Typography} from '@material-ui/core';
import {Theme} from 'src/theme';
import Page from 'src/components/Page';
import Logo from 'src/components/utils/Logo';
import JWTLogin from './JWTLogin';
import OAuthLoginButton from './OAuthLoginButton';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
    },
    cardContainer: {
        paddingBottom: 80,
        paddingTop: 80,
    },
    cardContent: {
        padding: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        minHeight: 400
    }
}));

const LoginView: FC = () => {
    const classes = useStyles();

    return (
        <Page
            className={classes.root}
            title="Login"
        >
            <Container
                className={classes.cardContainer}
                maxWidth="sm"
            >
                <Box
                    mb={8}
                    display="flex"
                    justifyContent="center"
                >
                    <RouterLink to="/">
                        <Logo/>
                    </RouterLink>
                </Box>
                <Card>
                    <CardContent className={classes.cardContent}>
                        <Box
                            alignItems="center"
                            display="flex"
                            justifyContent="space-between"
                            mb={3}
                        >
                            <div>
                                <Typography
                                    color="textPrimary"
                                    gutterBottom
                                    variant="h2"
                                >
                                    Sign in
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                >
                                    Sign in on Datatensor App
                                </Typography>
                            </div>
                        </Box>

                        <Box
                            display='flex'
                            mt={3}
                        >
                            <OAuthLoginButton scope='github'/>
                            <OAuthLoginButton scope='google'/>
                            <OAuthLoginButton scope='stackoverflow'/>
                        </Box>
                        <Box
                            mt={3}
                        >
                            <Divider/>
                        </Box>
                        <Box
                            flexGrow={1}
                            mt={3}
                        >
                            <JWTLogin/>
                        </Box>
                        <Box my={3}>
                            <Divider/>
                        </Box>
                        <Link
                            component={RouterLink}
                            to="/register"
                            variant="body2"
                            color="textSecondary"
                        >
                            Create new account
                        </Link>
                    </CardContent>
                </Card>
            </Container>
        </Page>
    );
};

export default LoginView;
