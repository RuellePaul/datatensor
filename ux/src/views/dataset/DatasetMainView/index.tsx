import React, {FC, useState} from 'react';
import {useParams} from 'react-router';
import {Box, Container, Divider, makeStyles, Tab, Tabs, Tooltip, Typography} from '@material-ui/core';
import Header from './Header';
import SectionImages from './sections/SectionImages';
import SectionLabeling from './sections/SectionLabeling';
import {Theme} from 'src/theme';
import Page from 'src/components/Page';
import {ImagesConsumer, ImagesProvider} from 'src/store/ImagesContext';
import {DatasetConsumer, DatasetProvider} from 'src/store/DatasetContext';


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        padding: theme.spacing(3, 0)
    }
}));

const SECTIONS = [<div/>, <SectionImages/>, <SectionLabeling/>];

const DatasetMainView: FC = () => {

    const classes = useStyles();

    const [tab, setTab] = useState(0);

    const handleTabChange = (event: React.ChangeEvent<{}>, newTab: number) => {
        setTab(newTab);
    };

    const {dataset_id} = useParams();

    if (!dataset_id)
        return null;

    return (
        <DatasetProvider dataset_id={dataset_id}>
            <DatasetConsumer>
                {value => (
                    <Page
                        className={classes.root}
                        title={`Dataset ${value.dataset.name}`}
                    >
                        <ImagesProvider>
                            <Container maxWidth="lg">
                                <Header/>

                                <Box mt={2}>
                                    <ImagesConsumer>
                                        {value => (
                                            <Tabs
                                                value={tab}
                                                onChange={handleTabChange}
                                                indicatorColor="primary"
                                                textColor="primary"
                                            >
                                                <Tab label="Overview"/>
                                                <Tab label="Images"/>
                                                <Tab
                                                    label={
                                                        value.images.length === 0
                                                            ? (
                                                                <Tooltip title={(
                                                                    <Typography variant='h6'>
                                                                        You need to upload images first
                                                                    </Typography>
                                                                )}>
                                                                    <span>Labeling</span>
                                                                </Tooltip>
                                                            )
                                                            : 'Labeling'

                                                    }
                                                    disabled={value.images.length === 0}
                                                    style={{pointerEvents: 'auto'}}
                                                />
                                            </Tabs>
                                        )}
                                    </ImagesConsumer>
                                </Box>

                                <Box mb={3}>
                                    <Divider/>
                                </Box>

                                {/* TODO : MAYBE THERE IS JUSTE HERE A HUGE IMPROVE TO MAKE */}
                                {SECTIONS[tab]}
                            </Container>
                        </ImagesProvider>
                    </Page>
                )}
            </DatasetConsumer>
        </DatasetProvider>
    );
};

export default DatasetMainView;
