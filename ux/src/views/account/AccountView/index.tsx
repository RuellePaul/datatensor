import React, {ChangeEvent, FC, useState} from 'react';
import {Box, Container, Divider, Tab, Tabs} from '@mui/material';

import {makeStyles} from '@mui/styles';

import Header from './Header';
import General from './General';
import Security from './Security';
import Unregister from './Unregister';
import Page from 'src/components/Page';
import useAuth from 'src/hooks/useAuth';
import {Theme} from 'src/theme';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const AccountView: FC = () => {
    const classes = useStyles();

    const {user} = useAuth();

    const [currentTab, setCurrentTab] = useState<string>('general');

    const tabs = [
        {value: 'general', label: 'General'},
        ...(!user.scope ? [{value: 'security', label: 'Security'}] : []),
        {value: 'unregister', label: 'Unregister'}
    ];

    const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
        setCurrentTab(value);
    };

    return (
        <Page className={classes.root} title="Settings">
            <Container component="section" maxWidth="lg">
                <Header />
                <Box mt={3}>
                    <Tabs
                        onChange={handleTabsChange}
                        scrollButtons="auto"
                        value={currentTab}
                        variant="scrollable"
                        textColor="primary"
                    >
                        {tabs.map(tab => (
                            <Tab key={tab.value} label={tab.label} value={tab.value} />
                        ))}
                    </Tabs>
                </Box>
                <Divider />
                <Box mt={3}>
                    {currentTab === 'general' && <General />}
                    {currentTab === 'security' && <Security />}
                    {currentTab === 'unregister' && <Unregister />}
                </Box>
            </Container>
        </Page>
    );
};

export default AccountView;
