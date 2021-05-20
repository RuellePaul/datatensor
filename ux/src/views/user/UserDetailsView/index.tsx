import React, {ChangeEvent, FC, useState} from 'react';
import {useParams} from 'react-router';
import {Box, Container, Divider, makeStyles, Tab, Tabs, Typography} from '@material-ui/core';
import {Theme} from 'src/theme';
import Page from 'src/components/Page';
import UserAvatar from 'src/components/UserAvatar';
import Header from './Header';
import Details from './Details';
import {UserConsumer, UserProvider} from 'src/store/UserContext';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        padding: theme.spacing(3, 0),
    }
}));

const UserDetailsView: FC = () => {
    const classes = useStyles();
    const [currentTab, setCurrentTab] = useState<string>('details');

    const {user_id} = useParams();

    const tabs = [
        {value: 'details', label: 'Details'}
    ];

    const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
        setCurrentTab(value);
    };

    if (!user_id) {
        return null;
    }

    return (
        <Page
            className={classes.root}
            title='User details'
        >
            <UserProvider user_id={user_id}>
                <Container maxWidth='lg'>
                    <Header/>

                    <Box display='flex' alignItems='center' mt={2}>
                        <UserConsumer>
                            {value =>
                                <UserAvatar
                                    user={value.user}
                                />
                            }
                        </UserConsumer>
                        <Box ml={2}>
                            <Typography variant='h6' color='textPrimary'>
                                <UserConsumer>
                                    {
                                        value => value.user.name
                                    }
                                </UserConsumer>
                            </Typography>
                        </Box>
                    </Box>

                    <Box mt={3}>
                        <Tabs
                            onChange={handleTabsChange}
                            scrollButtons="auto"
                            value={currentTab}
                            variant="scrollable"
                            textColor="secondary"
                        >
                            {tabs.map((tab) => (
                                <Tab
                                    key={tab.value}
                                    label={tab.label}
                                    value={tab.value}
                                />
                            ))}
                        </Tabs>
                    </Box>
                    <Divider/>
                    <Box mt={3}>
                        {currentTab === 'details' && (
                            <Details/>
                        )}
                    </Box>
                </Container>
            </UserProvider>
        </Page>
    );
};

export default UserDetailsView;
