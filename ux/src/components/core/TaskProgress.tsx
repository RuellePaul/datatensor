import React, {FC} from 'react';
import {Task} from 'src/types/task';
import {Box, LinearProgress, Typography} from '@mui/material';

interface TaskProgressProps {
    task: Task;
}

const TaskProgress: FC<TaskProgressProps> = ({task}) => {

    if (!task)
        return null;

    if (task.status === 'pending' || task.status === 'active')
        return (
            <Box display="flex" alignItems="center">
                <Box width="100%" mr={1}>
                    <LinearProgress
                        variant={(task.progress <= 0 || task.progress) >= 1 ? 'indeterminate' : 'determinate'}
                        value={100 * task.progress}
                    />
                </Box>
                <Typography variant="body2" color="textSecondary">
                    {`${(100 * task.progress).toFixed(2)}%`}
                </Typography>
            </Box>
        );

    return null;
};

export default TaskProgress;
