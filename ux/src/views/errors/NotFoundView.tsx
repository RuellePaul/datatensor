import React, {FC} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {Box, Button, Container, Typography, useMediaQuery, useTheme} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';
import Page from 'src/components/Page';
import {ArrowLeft as BackIcon} from 'react-feather';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(3),
        paddingTop: 80,
        paddingBottom: 80
    },
    image: {
        maxWidth: '100%',
        width: 560,
        maxHeight: 300,
        height: 'auto'
    }
}));

const NotFoundView: FC = () => {
    const classes = useStyles();
    const theme = useTheme();
    const mobileDevice = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Page className={classes.root} title="404: Not found">
            <Container component="section" maxWidth="lg">
                <Typography align="center" variant={mobileDevice ? 'h4' : 'h1'} color="textPrimary">
                    404: The page you are looking for isn’t here
                </Typography>
                <Typography align="center" variant="subtitle2" color="textSecondary">
                    You either tried some shady route or you came here by mistake. Whichever it is, try using the
                    navigation.
                </Typography>
                <Box mt={6} display="flex" justifyContent="center">
                    <img
                        alt="Under development"
                        className={classes.image}
                        src="/static/images/undraw_page_not_found_su7k.svg"
                    />
                </Box>
                <Box mt={6} display="flex" justifyContent="center">
                    <Box mr={2}>
                        <Button
                            color="primary"
                            onClick={() => window.history.back()}
                            startIcon={<BackIcon />}
                            variant="outlined"
                        >
                            Back to previous page
                        </Button>
                    </Box>
                    <Button color="primary" component={RouterLink} to="/app/dashboard" variant="contained">
                        Back to home
                    </Button>
                </Box>
            </Container>
        </Page>
    );
};

export default NotFoundView;
