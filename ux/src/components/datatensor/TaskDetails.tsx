import React, {FC} from 'react';
import {
    Box,
    capitalize,
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    Link,
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
import UserLabel from 'src/components/UserLabel';
import getDateDiff from 'src/utils/getDateDiff';

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
    close: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5, 0.5, 0.5, 0),
        }
    },
    link: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: theme.spacing(1),
        cursor: 'pointer'
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

                                <Grid
                                    item
                                    xs={12}
                                >
                                    <Box mb={2}>
                                        <Divider/>
                                    </Box>
                                    {
                                        task.type === 'generator' && (
                                            <>
                                                <Typography
                                                    color='textPrimary'
                                                    gutterBottom
                                                >
                                                    Generate <strong>{task.properties.image_count}</strong> images from
                                                    {' '}
                                                    <strong>
                                                        {task.properties.selected_categories.length}
                                                        {task.properties.selected_categories.length > 1
                                                            ? ' categories'
                                                            : ' category'
                                                        }
                                                    </strong> :
                                                </Typography>
                                                <div className={classes.chips}>
                                                    {task.properties.selected_categories.slice(0, 18).map(category => (
                                                        <Chip
                                                            label={capitalize(category)}
                                                            variant='outlined'
                                                        />
                                                    ))}
                                                    {task.properties.selected_categories.length > 18 && (
                                                        <Link
                                                            className={classes.link}
                                                            onClick={() => { /* TODO */ }}
                                                        >
                                                            and {task.properties.selected_categories.length - 18} more...
                                                        </Link>
                                                    )}
                                                </div>
                                            </>

                                        )
                                    }

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