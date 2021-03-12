import React, {ChangeEvent, FC, useCallback, useEffect, useState} from 'react';
import {useParams} from 'react-router';
import {Box, Container, Divider, makeStyles, Tab, Tabs} from '@material-ui/core';
import {Theme} from 'src/theme';
import Page from 'src/components/Page';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import {Dataset} from 'src/types/dataset';
import api from 'src/utils/api';
import Header from './Header';
import Details from './Details';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const UserDetailsView: FC = () => {
    const classes = useStyles();
    const isMountedRef = useIsMountedRef();
    const [datasets, setDatasets] = useState<Dataset[]>([]);
    const [currentTab, setCurrentTab] = useState<string>('details');

    const {userId} = useParams();

    const tabs = [
        {value: 'details', label: 'Details'}
    ];

    const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
        setCurrentTab(value);
    };

    const getDatasets = useCallback(async () => {
        try {
            const response = await api.get<Dataset[]>(`/v1/dataset/manage/`, {params: {user_id: userId}});

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

    if (!datasets) {
        return null;
    }

    return (
        <Page
            className={classes.root}
            title="User Details"
        >
            <Container maxWidth={false}>
                <Header userId={userId}/>
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
                        />
                    )}
                </Box>
            </Container>
        </Page>
    );
};

export default UserDetailsView;
