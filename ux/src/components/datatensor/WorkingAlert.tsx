import React, {FC} from 'react';
import clsx from 'clsx';
import {Box, CircularProgress, Link, makeStyles} from '@material-ui/core';
import {Theme} from 'src/theme';
import {Alert} from '@material-ui/lab';
import useTasks from 'src/hooks/useTasks';

interface WorkingAlertProps {
    dataset_id: string;
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    loader: {
        marginLeft: theme.spacing(1)
    },
    link: {
        cursor: 'pointer'
    }
}));


const WorkingAlert: FC<WorkingAlertProps> = ({
                                                 dataset_id,
                                                 className
                                             }) => {

    const classes = useStyles();

    const {tasks, saveSelectedTask} = useTasks();

    if (tasks === null)
        return null;

    const activeTask = tasks.find(task => task.status === 'active' && task.dataset_id === dataset_id);

    if (!activeTask)
        return null;

    const handleOpenTask = (event) => {
        event.stopPropagation();

        saveSelectedTask(activeTask);
    };


    return (
        <Box
            className={clsx(classes.root, className)}
            mt={2}
        >
            <Alert
                severity='warning'
            >
                <Link
                    className={classes.link}
                    color='inherit'
                    onClick={handleOpenTask}
                >
                    A task is running
                </Link>

                <CircularProgress
                    className={classes.loader}
                    color="inherit"
                    size={14}
                />

                <div className='flexGrow'/>
            </Alert>
        </Box>
    );
};

export default WorkingAlert;
