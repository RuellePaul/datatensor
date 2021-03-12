import React, {FC, useCallback, useEffect, useState} from 'react';
import {Box, Container, makeStyles} from '@material-ui/core';
import {Theme} from 'src/theme';
import api from 'src/utils/api';
import Page from 'src/components/Page';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import {Dataset} from 'src/types/dataset';
import Header from './Header';
import Results from './Results';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: 100
    }
}));

const DatasetListView: FC = () => {
    const classes = useStyles();
    const isMountedRef = useIsMountedRef();
    const [datasets, setDatasets] = useState<Dataset[]>([]);

    const getDatasets = useCallback(async () => {
        try {
            const response = await api.get<{ datasets: Dataset[]; }>('/api/datasets');

            if (isMountedRef.current) {
                setDatasets(response.data.datasets);
            }
        } catch (err) {
            console.error(err);
        }
    }, [isMountedRef]);

    useEffect(() => {
        getDatasets();
    }, [getDatasets]);

    return (
        <Page
            className={classes.root}
            title="Dataset List"
        >
            <Container maxWidth={false}>
                <Header/>
                {datasets && (
                    <Box mt={3}>
                        <Results datasets={datasets}/>
                    </Box>
                )}
            </Container>
        </Page>
    );
};

export default DatasetListView;
