import React, {FC} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {Box, Card, CardContent, Container, Divider, Link, Typography} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';
import Page from 'src/components/Page';
import Logo from 'src/components/utils/Logo';
import JWTRegister from './JWTRegister';
import OAuthLoginButton from 'src/views/auth/LoginView/OAuthLoginButton';


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
        padding: theme.spacing(3, 4),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(3, 2)
        }
    },
    auth0buttons: {
        display: 'flex',
        marginTop: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column'
        }
    }
}));

const RegisterView: FC = () => {
    const classes = useStyles();

    return (
        <Page className={classes.root} title="Register">
            <Container component="section" className={classes.cardContainer} maxWidth="sm">
                <Box mb={8} display="flex" justifyContent="center">
                    <RouterLink to="/">
                        <Logo />
                    </RouterLink>
                </Box>
                <Card>
                    <CardContent className={classes.cardContent}>
                        <Typography color="textPrimary" gutterBottom variant="h2">
                            Create an account
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Sign up now on Datatensor
                        </Typography>

                        <Box mt={3}>
                            <Divider>
                                <Typography variant="overline">with external app</Typography>
                            </Divider>
                        </Box>

                        <Box className={classes.auth0buttons}>
                            <OAuthLoginButton scope="github" />
                            <OAuthLoginButton scope="google" />
                            <OAuthLoginButton scope="stackoverflow" />
                        </Box>

                        <Box mt={3} mb={1}>
                            <Divider>
                                <Typography variant="overline">with your email</Typography>
                            </Divider>
                        </Box>

                        <JWTRegister />

                        <Box my={3}>
                            <Divider />
                        </Box>

                        <Link component={RouterLink} to="/auth/login" variant="body2" color="primary">
                            Having an account ?
                        </Link>
                    </CardContent>
                </Card>
            </Container>
        </Page>
    );
};

export default RegisterView;
