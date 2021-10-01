import React, {FC} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Container,
    Divider,
    Link,
    Typography
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';
import Page from 'src/components/Page';
import Logo from 'src/components/utils/Logo';
import JWTRegister from './JWTRegister';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
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
        minHeight: 400
    }
}));

const RegisterView: FC = () => {
    const classes = useStyles();

    return (
        <Page className={classes.root} title="Register">
            <Container
                component="section"
                className={classes.cardContainer}
                maxWidth="sm"
            >
                <Box mb={8} display="flex" justifyContent="center">
                    <RouterLink to="/">
                        <Logo />
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
                        </Box>
                        <Box flexGrow={1} mt={3}>
                            <JWTRegister />
                        </Box>
                        <Box my={3}>
                            <Divider />
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
