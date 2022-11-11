import React, {FC, useEffect} from 'react';
import {useParams} from 'react-router';
import {useSnackbar} from 'notistack';

import {Box, Collapse, Container} from '@mui/material';
import {makeStyles} from '@mui/styles';
import Header from './Header';
import SectionOverview from './sections/SectionOverview';
import SectionImages from './sections/SectionImages';
import SectionSettings from './sections/SectionSettings';
import {Theme} from 'src/theme';
import Page from 'src/components/Page';
import DTLabelisator from 'src/components/core/Labelisator';
import TaskSnackbar from 'src/components/core/Task/TaskSnackbar';
import useAuth from 'src/hooks/useAuth';
import {ImagesProvider} from 'src/store/ImagesContext';
import {DatasetConsumer, DatasetProvider} from 'src/store/DatasetContext';
import {UserProvider} from 'src/store/UserContext';
import {CategoryProvider} from 'src/store/CategoryContext';
import {TasksProvider} from 'src/store/TasksContext';
import useTasks from 'src/hooks/useTasks';
import useDataset from 'src/hooks/useDataset';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        padding: theme.spacing(3, 0)
    },
    tab: {
        color: theme.palette.text.primary,
        fontSize: 16
    },
    wrapper: {
        '& .label': {
            marginLeft: theme.spacing(1),
            [theme.breakpoints.down('sm')]: {
                display: 'none'
            }
        }
    }
}));

const TriggerTaskSnackbar: FC = () => {
    const {enqueueSnackbar} = useSnackbar();

    const {tasks} = useTasks();
    const {dataset} = useDataset();

    const activeTask = (tasks || []).find(
        task => task.dataset_id === dataset.id && ['pending', 'active'].includes(task.status)
    );

    useEffect(() => {
        if (activeTask)
            enqueueSnackbar(activeTask.id, {
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                },
                content: key => <TaskSnackbar id={key} dataset_id={dataset.id} task={activeTask} />,
                TransitionComponent: Collapse,
                persist: true
            });
    }, [activeTask, enqueueSnackbar, dataset.id]);

    return null;
};

const DatasetMainView: FC = () => {
    const classes = useStyles();

    const {user} = useAuth();
    const {dataset_id} = useParams();

    if (!dataset_id) return null;

    return (
        <TasksProvider dataset_id={dataset_id}>
            <DatasetProvider dataset_id={dataset_id}>
                <DatasetConsumer>
                    {value => (
                        <UserProvider user={value.dataset.user}>
                            <Page className={classes.root} title={`Dataset ${value.dataset.name}`}>
                                <ImagesProvider>
                                    <CategoryProvider>
                                        <Container component="section" maxWidth="lg">
                                            <Header />

                                            <Box my={4}>
                                                <SectionOverview />

                                                <SectionImages />

                                                {value.dataset.user_id === user.id && <SectionSettings />}
                                            </Box>
                                        </Container>
                                    </CategoryProvider>
                                    <CategoryProvider>
                                        <DTLabelisator />
                                    </CategoryProvider>
                                </ImagesProvider>
                            </Page>
                        </UserProvider>
                    )}
                </DatasetConsumer>

                <TriggerTaskSnackbar />
            </DatasetProvider>
        </TasksProvider>
    );
};

export default DatasetMainView;
