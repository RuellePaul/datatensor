import React, {FC, useEffect, useState} from 'react';
import {useParams} from 'react-router';
import clsx from 'clsx';
import {Box, Container, Divider, Tab, Tabs, Tooltip, Typography} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {TabContext} from '@mui/lab';
import Header from './Header';
import SectionOverview from './sections/SectionOverview';
import SectionImages from './sections/SectionImages';
import SectionAugmentation from './sections/SectionAugmentation';
import SectionSettings from './sections/SectionSettings';
import {DashboardOutlined, DynamicFeedOutlined, PhotoLibraryOutlined, SettingsOutlined} from '@mui/icons-material';
import {Theme} from 'src/theme';
import Page from 'src/components/Page';
import DTLabelisator from 'src/components/core/Labelisator';
import {ImagesConsumer, ImagesProvider} from 'src/store/ImagesContext';
import {DatasetConsumer, DatasetProvider} from 'src/store/DatasetContext';
import {UserProvider} from 'src/store/UserContext';
import {CategoryProvider} from 'src/store/CategoryContext';
import {PipelineProvider} from 'src/store/PipelineContext';
import {ExportsProvider} from 'src/store/ExportsContext';


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        padding: theme.spacing(3, 0)
    },
    sticky: {
        position: 'sticky',
        top: 0,
        background: theme.palette.background.default,
        zIndex: 1100,
        boxShadow: theme.palette.mode === 'dark' && theme.shadows[2]
    },
    tab: {
        color: theme.palette.text.primary,
        '&:hover, &$selected': {
            color: theme.palette.text.primary
        }
    }
}));

const DTTab = ({ label, icon: Icon, ...rest }) => {
    const classes = useStyles();

    const TabLabel = (
        <Box display="flex" alignItems="center">
            <Icon fontSize="small" />

            <Box ml={1}>{label}</Box>
        </Box>
    );

    return <Tab {...rest} label={TabLabel} className={classes.tab} />;
};

const DatasetMainView: FC = () => {
    const classes = useStyles();

    const [tab, setTab] = useState<number>(0);
    const [openedTabs, setOpenedTabs] = useState<number[]>([0]);

    const handleTabChange = (event: React.ChangeEvent<{}>, newTab: number) => {
        setTab(newTab);
    };

    const { dataset_id } = useParams();

    useEffect(() => {
        setOpenedTabs(openedTabs => (openedTabs.includes(tab) ? openedTabs : [...openedTabs, tab]));
    }, [tab]);

    if (!dataset_id) return null;

    return (
        <DatasetProvider dataset_id={dataset_id}>
            <DatasetConsumer>
                {value => (
                    <UserProvider user_id={value.dataset.user_id}>

                        <Page className={classes.root} title={`Dataset ${value.dataset.name}`}>
                            <ExportsProvider>
                                <ImagesProvider>
                                    <PipelineProvider>
                                        <CategoryProvider>
                                            <TabContext value={tab.toString()}>
                                                <Container component="section" maxWidth="lg">
                                                    <Header />

                                                    <Box className={classes.sticky} mt={2}>
                                                        <ImagesConsumer>
                                                            {value => (
                                                                <Tabs
                                                                    centered
                                                                    value={tab}
                                                                    onChange={handleTabChange}
                                                                >
                                                                    <DTTab label="Overview" icon={DashboardOutlined} />
                                                                    <DTTab
                                                                        label="Images"
                                                                        icon={PhotoLibraryOutlined}
                                                                        id="dt-tab-images"
                                                                    />
                                                                    <DTTab
                                                                        label={
                                                                            value.images.length === 0 ? (
                                                                                <Tooltip
                                                                                    title={
                                                                                        <Typography variant="h6">
                                                                                            You need to upload images
                                                                                            first
                                                                                        </Typography>
                                                                                    }
                                                                                >
                                                                                    <span>Augmentation</span>
                                                                                </Tooltip>
                                                                            ) : (
                                                                                'Augmentation'
                                                                            )
                                                                        }
                                                                        disabled={value.images.length === 0}
                                                                        style={{
                                                                            pointerEvents: 'auto'
                                                                        }}
                                                                        icon={DynamicFeedOutlined}
                                                                    />

                                                                    <DTTab label="Settings" icon={SettingsOutlined} />
                                                                </Tabs>
                                                            )}
                                                        </ImagesConsumer>

                                                        <Divider />
                                                    </Box>

                                                    <Box mb={3} />

                                                    {openedTabs.includes(0) && (
                                                        <SectionOverview className={clsx(tab !== 0 && 'hidden')} />
                                                    )}
                                                    {openedTabs.includes(1) && (
                                                        <SectionImages className={clsx(tab !== 1 && 'hidden')} />
                                                    )}
                                                    {openedTabs.includes(2) && (
                                                        <SectionAugmentation className={clsx(tab !== 2 && 'hidden')} />
                                                    )}
                                                    {openedTabs.includes(3) && (
                                                        <SectionSettings className={clsx(tab !== 3 && 'hidden')} />
                                                    )}
                                                </Container>

                                                <DTLabelisator />
                                            </TabContext>
                                        </CategoryProvider>
                                    </PipelineProvider>
                                </ImagesProvider>
                            </ExportsProvider>
                        </Page>
                    </UserProvider>
                )}
            </DatasetConsumer>
        </DatasetProvider>
    );
};

export default DatasetMainView;
