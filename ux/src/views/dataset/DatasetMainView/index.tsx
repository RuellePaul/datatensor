import React, {FC, useCallback, useEffect, useState} from 'react';
import {useParams} from 'react-router';
import {Box, Container, Divider, makeStyles, Tab, Tabs} from '@material-ui/core';
import Header from './Header';
import SectionImages from './sections/SectionImages';
import SectionLabeling from './sections/SectionLabeling';
import {Theme} from 'src/theme';
import Page from 'src/components/Page';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import {Dataset} from 'src/types/dataset';
import api from 'src/utils/api';
import {ImagesProvider} from 'src/contexts/ImagesContext';


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        padding: theme.spacing(3, 0)
    }
}));

const SECTIONS = [<div/>, <SectionImages/>, <SectionLabeling/>];

const DatasetMainView: FC = () => {
    const {dataset_id} = useParams();

    const classes = useStyles();
    const isMountedRef = useIsMountedRef();

    const [tab, setTab] = useState(0);

    const handleTabChange = (event: React.ChangeEvent<{}>, newTab: number) => {
        setTab(newTab);
    };

    const [dataset, setDataset] = useState<Dataset>();

    const getDataset = useCallback(async () => {
        try {
            const response = await api.get<Dataset>(`/v1/dataset/manage/${dataset_id}`);

            if (isMountedRef.current) {
                setDataset(response.data);
            }
        } catch (err) {
            console.error(err);
        }
    }, [isMountedRef, dataset_id]);

    useEffect(() => {
        getDataset();
    }, [getDataset]);

    if (!dataset)
        return null;

    return (
        <Page
            className={classes.root}
            title="Dataset List"
        >
            <Container maxWidth="lg">
                <Header dataset={dataset}/>

                <Box mt={2}>
                    <Tabs
                        value={tab}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <Tab label="Overview"/>
                        <Tab label="Images"/>
                        <Tab label="Labeling"/>
                    </Tabs>
                </Box>

                <Box mb={3}>
                    <Divider/>
                </Box>

                <ImagesProvider dataset_id={dataset_id}>
                    {SECTIONS[tab]}
                </ImagesProvider>
            </Container>
        </Page>
    );
};

export default DatasetMainView;
