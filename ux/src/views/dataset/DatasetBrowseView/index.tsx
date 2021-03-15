import React, {FC, useCallback, useEffect, useState} from 'react';
import {Box, Container, makeStyles} from '@material-ui/core';
import {Theme} from 'src/theme';
import Page from 'src/components/Page';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import {Dataset} from 'src/types/dataset';
import Header from './Header';
import Filter from './Filter';
import Results from './Results';
import api from 'src/utils/api'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        padding: theme.spacing(3, 0)
    }
}));

const DatasetBrowseView: FC = () => {
    const classes = useStyles();
    const isMountedRef = useIsMountedRef();
    const [datasets, setDatasets] = useState<Dataset[]>([]);

    const getDatasets = useCallback(async () => {
        try {
            const response = await api.get<Dataset[]>('/v1/dataset/manage/');

            if (isMountedRef.current) {
                setDatasets(response.data);
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
            <Container maxWidth="lg">
                <Header/>
                <Box mt={3}>
                    <Filter/>
                </Box>
                <Box mt={6}>
                    <Results datasets={datasets}/>
                </Box>
            </Container>
        </Page>
    );
}

export default DatasetBrowseView;
