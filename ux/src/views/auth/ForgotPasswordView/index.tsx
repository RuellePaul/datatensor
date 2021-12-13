import React, {FC} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {Box, Card, CardContent, Container, Typography} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';
import Page from 'src/components/Page';
import Logo from 'src/components/utils/Logo';
import JWTForgotPassword from './JWTForgotPassword';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh'
    },
    cardContainer: {
        paddingBottom: 80,
        paddingTop: 80
    },
    cardContent: {
        padding: theme.spacing(4),
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

const ForgotPasswordView: FC = () => {
    const classes = useStyles();

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
                        <Box alignItems="center" display="flex" justifyContent="space-between" mb={1}>
                            <div>
                                <Typography color="textPrimary" gutterBottom variant="h2">
                                    Forgot password
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Enter your email address below, we will send you a password recovery link{' '}
                                </Typography>
                            </div>
                        </Box>

                        <JWTForgotPassword />
                    </CardContent>
                </Card>
            </Container>
        </Page>
    );
};

export default ForgotPasswordView;
