import React, {FC} from 'react';
import {
    capitalize,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    makeStyles,
    Typography
} from '@material-ui/core';
import {Close as CloseIcon} from '@material-ui/icons';
import {Theme} from 'src/theme';
import {TaskStatus} from 'src/types/task';
import {UserConsumer, UserProvider} from 'src/store/UserContext';
import {DatasetConsumer, DatasetProvider} from 'src/store/DatasetContext';
import useTasks from 'src/hooks/useTasks';
import FancyLabel from 'src/components/FancyLabel';
import UserLabel from '../UserLabel';
import getDateDiff from '../../utils/getDateDiff';

interface TaskDetailsProps {

}

interface TaskStatusProps {
    status: TaskStatus
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    dialog: {
        padding: theme.spacing(1, 2, 2)
    },
    username: {
        marginLeft: '8px !important'
    },
    avatar: {
        width: 20,
        height: 20
    },
    close: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    }
}));

function colorReducer(status) {
    switch (status) {
        case 'pending':
            return 'default'
        case 'success':
            return 'success'
        case 'active':
            return 'info'
        case 'failed':
            return 'error'
        default:
            throw new Error('Invalid status')
    }
}

export const TaskStatusLabel: FC<TaskStatusProps> = ({status}) => {

    return (
        <FancyLabel color={colorReducer(status)}>
            {status}
        </FancyLabel>
    )
}

const TaskDetails: FC<TaskDetailsProps> = () => {

    const classes = useStyles();

    const {selectedTask: task, saveSelectedTask} = useTasks();

    const handleClose = () => {
        saveSelectedTask(null);
    }

    return (
        <UserProvider user_id={task?.user_id}>
            <Dialog
                closeAfterTransition
                disableRestoreFocus
                PaperProps={{
                    className: classes.dialog
                }}
                fullWidth
                maxWidth='sm'
                open={task !== null}
                onClose={handleClose}
            >
                {task && (
                    <>
                        <DialogTitle
                            className='flex'
                            disableTypography
                        >
                            <div>
                                <Typography variant='h4'>
                                    {capitalize(task.type)}
                                </Typography>
                                <Typography color='textSecondary'>
                                    {getDateDiff(new Date(), task.created_at, 'passed_event')}
                                </Typography>
                            </div>

                            <IconButton
                                className={classes.close}
                                onClick={handleClose}
                            >
                                <CloseIcon/>
                            </IconButton>
                        </DialogTitle>
                        <DialogContent
                            className='scroll'
                        >
                            <Grid
                                container
                                spacing={2}
                            >
                                <Grid
                                    item
                                    sm={6}
                                    xs={12}
                                >
                                    <Typography
                                        variant="overline"
                                        color="inherit"
                                        gutterBottom
                                    >
                                        Created by
                                    </Typography>
                                    <UserConsumer>
                                        {
                                            value => <UserLabel user={value.user}/>
                                        }
                                    </UserConsumer>
                                </Grid>
                                <Grid
                                    item
                                    sm={6}
                                    xs={12}
                                >
                                    <Typography
                                        variant="overline"
                                        color="inherit"
                                        gutterBottom
                                    >
                                        Status
                                    </Typography>

                                    <br/>

                                    <TaskStatusLabel status={task.status}/>

                                </Grid>
                            </Grid>


                            <DatasetProvider dataset_id={task?.dataset_id}>
                                <DatasetConsumer>
                                    {value => (
                                        <div/>
                                    )}
                                </DatasetConsumer>
                            </DatasetProvider>
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </UserProvider>
    )
};

export default TaskDetails;