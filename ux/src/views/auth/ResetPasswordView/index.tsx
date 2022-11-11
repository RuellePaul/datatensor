import React, {FC} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {Box, Card, CardContent, Container, Typography} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';
import Page from 'src/components/Page';
import Logo from 'src/components/utils/Logo';
import parseQueryArgs from 'src/utils/parseQueryArgs';
import JWTResetPassword from './JWTResetPassword';


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

const ResetPasswordView: FC = () => {
    const classes = useStyles();

    const recovery_code = parseQueryArgs('recovery_code');

    if (!recovery_code) return null;

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
                                    Reset password
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Please set your new password.
                                </Typography>
                            </div>
                        </Box>

                        <JWTResetPassword />
                    </CardContent>
                </Card>
            </Container>
        </Page>
    );
};

export default ResetPasswordView;
