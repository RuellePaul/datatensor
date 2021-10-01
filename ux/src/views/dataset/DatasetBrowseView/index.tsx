import React, {FC} from 'react';
import {Box, Container} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';
import Page from 'src/components/Page';
import Header from './Header';
import Filter from './Filter';
import Results from './Results';
import {DatasetsProvider} from 'src/store/DatasetsContext';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        minHeight: '100%',
        padding: theme.spacing(3, 0)
    }
}));

const DatasetBrowseView: FC = () => {
    const classes = useStyles();

    return (
        <Page className={classes.root} title="Dataset List">
            <DatasetsProvider>
                <Container component="section" maxWidth="lg">
                    <Header />
                    <Box mt={3}>
                        <Filter />
                    </Box>
                    <Box mt={6}>
                        <Results />
                    </Box>
                </Container>
            </DatasetsProvider>
        </Page>
    );
};

export default DatasetBrowseView;
