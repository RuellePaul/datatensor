import React, {FC} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {Box, Card, CardContent, Container, Divider, Link, makeStyles, Typography} from '@material-ui/core';
import {Theme} from 'src/theme';
import Page from 'src/components/Page';
import Logo from 'src/components/Logo';
import useAuth from 'src/hooks/useAuth';
import Auth0Register from './Auth0Register';
import JWTRegister from './JWTRegister';

const methodIcons = {
    'Auth0': '/static/images/auth0.svg',
    'JWT': '/static/images/jwt.svg'
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
    },
    methodIcon: {
        height: 30,
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2)
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
    },
    currentMethodIcon: {
        height: 40,
        '& > img': {
            width: 'auto',
            maxHeight: '100%'
        }
    }
}));

const RegisterView: FC = () => {
    const classes = useStyles();
    const {method} = useAuth() as any;

    return (
        <Page
            className={classes.root}
            title="Register"
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
                                    Register
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                >
                                    Register on the internal platform
                                </Typography>
                            </div>
                            <div className={classes.currentMethodIcon}>
                                <img
                                    alt="Auth method"
                                    src={methodIcons[method]}
                                />
                            </div>
                        </Box>
                        <Box
                            flexGrow={1}
                            mt={3}
                        >
                            <Auth0Register/>
                            <JWTRegister/>
                        </Box>
                        <Box my={3}>
                            <Divider/>
                        </Box>
                        <Link
                            component={RouterLink}
                            to="/login"
                            variant="body2"
                            color="textSecondary"
                        >
                            Having an account
                        </Link>
                    </CardContent>
                </Card>
            </Container>
        </Page>
    );
};

export default RegisterView;
