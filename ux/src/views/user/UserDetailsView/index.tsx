import React, {ChangeEvent, FC, useCallback, useEffect, useState} from 'react';
import {useParams} from 'react-router';
import {Box, Container, Divider, makeStyles, Tab, Tabs, Typography} from '@material-ui/core';
import {Theme} from 'src/theme';
import Page from 'src/components/Page';
import UserAvatar from 'src/components/UserAvatar';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import {User} from 'src/types/user';
import api from 'src/utils/api';
import Header from './Header';
import Details from './Details';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        padding: theme.spacing(3, 0),
    }
}));

const UserDetailsView: FC = () => {
    const classes = useStyles();
    const isMountedRef = useIsMountedRef();
    const [user, setUser] = useState<User>();
    const [currentTab, setCurrentTab] = useState<string>('details');

    const {user_id} = useParams();

    const tabs = [
        {value: 'details', label: 'Details'}
    ];

    const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
        setCurrentTab(value);
    };

    const getUser = useCallback(async () => {
        try {
            const response = await api.get<{ user: User }>(`/users/${user_id}`);

            if (isMountedRef.current) {
                setUser(response.data.user);
            }
        } catch (err) {
            console.error(err);
        }
    }, [user_id, isMountedRef]);

    useEffect(() => {
        getUser();
    }, [getUser]);

    if (!user) {
        return null;
    }

    return (
        <Page
            className={classes.root}
            title={user.name}
        >
            <Container maxWidth='lg'>
                <Header user={user}/>

                <Box display='flex' alignItems='center' mt={2}>
                    <UserAvatar user={user}/>
                    <Box ml={2}>

                        <Typography variant='h6' color='textPrimary'>
                            {user.name}
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
                        <Details
                            user={user}
                        />
                    )}
                </Box>
            </Container>
        </Page>
    );
};

export default UserDetailsView;
