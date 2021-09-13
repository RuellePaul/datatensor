import React, {FC, useEffect, useState} from 'react';
import {useParams} from 'react-router';
import clsx from 'clsx';
import {Box, Container, Divider, makeStyles, Tab, Tabs, Tooltip, Typography} from '@material-ui/core';
import {TabContext} from '@material-ui/lab';
import Header from './Header';
import SectionOverview from './sections/SectionOverview';
import SectionImages from './sections/SectionImages';
import SectionAugmentation from './sections/SectionAugmentation';
import SectionSettings from './sections/SectionSettings';
import {DashboardOutlined, DynamicFeedOutlined, PhotoLibraryOutlined, SettingsOutlined} from '@material-ui/icons';
import {Theme} from 'src/theme';
import Page from 'src/components/Page';
import WorkingAlert from 'src/components/datatensor/WorkingAlert';
import {ImagesConsumer, ImagesProvider} from 'src/store/ImagesContext';
import {DatasetConsumer, DatasetProvider} from 'src/store/DatasetContext';


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        padding: theme.spacing(3, 0)
    },
    tab: {
        color: theme.palette.text.primary,
        '&:hover, &$selected': {
            color: theme.palette.text.primary
        }
    }

}));

const DTTab = ({label, icon: Icon, ...rest}) => {

    const classes = useStyles();

    const TabLabel = (
        <Box display='flex' alignItems='center'>
            <Icon fontSize='small'/>

            <Box ml={1}>
                {label}
            </Box>
        </Box>
    )

    return (
        <Tab {...rest} label={TabLabel} className={classes.tab}/>
    )
}

const DatasetMainView: FC = () => {

    const classes = useStyles();

    const [tab, setTab] = useState<number>(0);
    const [openedTabs, setOpenedTabs] = useState<number[]>([0]);

    const handleTabChange = (event: React.ChangeEvent<{}>, newTab: number) => {
        setTab(newTab);
    };

    const {dataset_id} = useParams();

    useEffect(() => {
        setOpenedTabs(openedTabs => openedTabs.includes(tab)
            ? openedTabs
            : [...openedTabs, tab]);
    }, [tab]);

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
                            <TabContext value={tab.toString()}>
                                <Container component='section' maxWidth='lg'>
                                    <Header/>

                                    <WorkingAlert dataset_id={dataset_id}/>

                                    <Box mt={2}>
                                        <ImagesConsumer>
                                            {value => (
                                                <Tabs
                                                    value={tab}
                                                    onChange={handleTabChange}
                                                    scrollButtons="auto"
                                                    variant="scrollable"
                                                >
                                                    <DTTab label="Overview" icon={DashboardOutlined}/>
                                                    <DTTab label="Images" icon={PhotoLibraryOutlined}/>
                                                    <DTTab
                                                        label={
                                                            value.images.length === 0
                                                                ? (
                                                                    <Tooltip title={(
                                                                        <Typography variant='h6'>
                                                                            You need to upload images first
                                                                        </Typography>
                                                                    )}>
                                                                        <span>Augmentation</span>
                                                                    </Tooltip>
                                                                )
                                                                : 'Augmentation'

                                                        }
                                                        disabled={value.images.length === 0}
                                                        style={{pointerEvents: 'auto'}}
                                                        icon={DynamicFeedOutlined}
                                                    />

                                                    <DTTab label="Settings" icon={SettingsOutlined}/>
                                                </Tabs>
                                            )}
                                        </ImagesConsumer>
                                    </Box>

                                    <Box mb={3}>
                                        <Divider/>
                                    </Box>

                                    {openedTabs.includes(0) && (
                                        <SectionOverview
                                            className={clsx(tab !== 0 && 'hidden')}
                                        />
                                    )}
                                    {openedTabs.includes(1) && (
                                        <SectionImages
                                            className={clsx(tab !== 1 && 'hidden')}
                                        />
                                    )}
                                    {openedTabs.includes(2) && (
                                        <SectionAugmentation
                                            className={clsx(tab !== 2 && 'hidden')}
                                        />
                                    )}
                                    {openedTabs.includes(3) && (
                                        <SectionSettings
                                            className={clsx(tab !== 3 && 'hidden')}
                                        />
                                    )}
                                </Container>
                            </TabContext>
                        </ImagesProvider>
                    </Page>
                )}
            </DatasetConsumer>
        </DatasetProvider>
    );
};

export default DatasetMainView;
