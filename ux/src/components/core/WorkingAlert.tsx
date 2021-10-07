import React, {FC} from 'react';
import clsx from 'clsx';
import {Alert, Box, CircularProgress, Link} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';
import useTasks from 'src/hooks/useTasks';


interface WorkingAlertProps {
    dataset_id: string;
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    loader: {
        marginLeft: theme.spacing(1)
    }
}));

const WorkingAlert: FC<WorkingAlertProps> = ({dataset_id, className}) => {
    const classes = useStyles();

    const {tasks, saveSelectedTask} = useTasks();

    if (tasks === null) return null;

    const activeTask = tasks.find(task => task.status === 'active' && task.dataset_id === dataset_id);
    const activeTasksCount = tasks.filter(task => task.status === 'active' && task.dataset_id === dataset_id).length;

    if (!activeTask) return null;

    const handleOpenTask = event => {
        event.stopPropagation();

        saveSelectedTask(activeTask);
    };

    return (
        <Box className={clsx(classes.root, className)} mt={2}>
            <Alert severity="warning">
                <Link color="inherit" onClick={handleOpenTask}>
                    {activeTasksCount > 1 ? 'Some tasks are running' : 'A task is running'}
                </Link>

                <CircularProgress className={classes.loader} color="inherit" size={14} />

                <div className="flexGrow" />
            </Alert>
        </Box>
    );
};

export default WorkingAlert;
