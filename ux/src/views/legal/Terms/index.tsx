import React, {FC} from 'react';
import {makeStyles} from '@mui/styles';
import Page from 'src/components/Page';
import {Theme} from 'src/theme';
import {Alert, AlertTitle, Container, Typography} from '@mui/material';


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh',
        paddingTop: 64
    }
}));

const TermsView: FC = () => {
    const classes = useStyles();

    return (
        <Page className={classes.root} title="Terms">
            <Container maxWidth="md" sx={{py: 4}}>
                <Typography variant="h1" color="textPrimary" gutterBottom>
                    Terms
                </Typography>

                <Alert severity="warning">
                    <AlertTitle>Incoming</AlertTitle>
                    This page will be coming soon.
                </Alert>
            </Container>
        </Page>
    );
};

export default TermsView;
