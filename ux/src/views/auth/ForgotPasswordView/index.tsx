import React, {FC, useEffect} from 'react';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import {Box, Card, CardContent, Container, Typography} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';
import Page from 'src/components/Page';
import Logo from 'src/components/utils/Logo';
import JWTForgotPassword from './JWTForgotPassword';
import parseQueryArgs from 'src/utils/parseQueryArgs';


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
    }
}));

const ForgotPasswordView: FC = () => {
    const classes = useStyles();
    const history = useHistory();

    const recovery_code = parseQueryArgs('recovery_code');

    useEffect(() => {
        if (recovery_code) history.push(`/auth/reset-password?recovery_code=${recovery_code}`);
    }, [recovery_code, history]);

    if (recovery_code) return null;

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
