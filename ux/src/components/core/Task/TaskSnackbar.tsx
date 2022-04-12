import React, {FC, forwardRef} from 'react';
import clsx from 'clsx';
import {SnackbarContent} from 'notistack';

import {Box, Card, Typography} from '@mui/material';

import FancyLabel from 'src/components/FancyLabel';
import {Task, TaskStatus} from 'src/types/task';
import {useSelector} from 'src/store';
import TaskProgress from './TaskProgress';

function colorReducer(status) {
    switch (status) {
        case 'pending':
            return 'default';
        case 'success':
            return 'success';
        case 'active':
            return 'info';
        case 'failed':
            return 'error';
        default:
            throw new Error('Invalid status');
    }
}

interface TaskStatusProps {
    status: TaskStatus;
}

const TaskStatusLabel: FC<TaskStatusProps> = ({status}) => {
    return (
        <FancyLabel className={clsx(status === 'pending' && 'blinking')} color={colorReducer(status)}>
            {status}
        </FancyLabel>
    );
};

const TaskSnackbar = forwardRef<HTMLDivElement, {id: string | number; dataset_id: string; task: Task}>(
    ({id, dataset_id, task}, ref) => {
        const {tasks} = useSelector(state => state.tasks);
        const activeTask = (tasks || []).find(
            task => task.dataset_id === dataset_id && ['pending', 'active'].includes(task.status)
        );

        if (!activeTask) return null;
        if (activeTask.id !== task.id) return null;

        return (
            <SnackbarContent ref={ref}>
                <Card
                    sx={{
                        background: '#313131',
                        px: 2,
                        py: 1,
                        width: '100%'
                    }}
                >
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="overline" color="textPrimary" align="center" component="span">
                            {activeTask.type} task
                        </Typography>

                        <TaskStatusLabel status={activeTask.status} />
                    </Box>

                    <TaskProgress task={activeTask} />
                </Card>
            </SnackbarContent>
        );
    }
);

export default TaskSnackbar;
