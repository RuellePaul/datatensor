import React, {ChangeEvent, FC, useCallback, useEffect, useState} from 'react';
import {useParams} from 'react-router';
import {Box, Container, Divider, makeStyles, Tab, Tabs} from '@material-ui/core';
import {Theme} from 'src/theme';
import Page from 'src/components/Page';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import {Dataset} from 'src/types/dataset';
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
    const [datasets, setDatasets] = useState<Dataset[]>([]);
    const [currentTab, setCurrentTab] = useState<string>('details');

    const {user_id} = useParams();

    const tabs = [
        {value: 'details', label: 'Details'}
    ];

    const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
        setCurrentTab(value);
    };

    const getDatasets = useCallback(async () => {
        try {
            const responseUser = await api.get<User>(`/v1/admin/manage/users/${user_id}`);
            const responseDatasets = await api.get<Dataset[]>(`/v1/admin/manage/datasets/${user_id}`);

            if (isMountedRef.current) {
                setUser(responseUser.data);
                setDatasets(responseDatasets.data);
            }
        } catch (err) {
            console.error(err);
        }
    }, [user_id, isMountedRef]);

    useEffect(() => {
        getDatasets();
    }, [getDatasets]);

    if (!user) {
        return null;
    }

    return (
        <Page
            className={classes.root}
            title="User Details"
        >
            <Container maxWidth={false}>
                <Header user={user}/>
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
                            datasets={datasets}
                            user={user}
                        />
                    )}
                </Box>
            </Container>
        </Page>
    );
};

export default UserDetailsView;
