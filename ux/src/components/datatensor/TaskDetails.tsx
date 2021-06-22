import React, {FC} from 'react';
import moment from 'moment';
import {Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, makeStyles, Typography} from '@material-ui/core';
import {Close as CloseIcon} from '@material-ui/icons';
import {Theme} from 'src/theme';
import {TaskType} from 'src/types/task';
import {UserProvider} from 'src/store/UserContext';
import {DatasetConsumer, DatasetProvider} from 'src/store/DatasetContext';
import DTDataset from 'src/components/datatensor/Dataset';
import useTasks from 'src/hooks/useTasks';

interface TaskDetailsProps {

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
    }
}));

function translateType(type: TaskType) {
    switch (type) {
        case 'generator':
            return '🏗️ Generator'
        case 'augmentor':
            return 'Images augmentation'
    }
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
                disableRestoreFocus
                PaperProps={{
                    className: classes.dialog
                }}
                fullWidth
                maxWidth='md'
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
                                    Task details
                                </Typography>
                                <Typography color='textSecondary'>
                                    ID : {task._id}
                                </Typography>
                            </div>

                            <IconButton
                                className={classes.close}
                                onClick={handleClose}
                            >
                                <CloseIcon/>
                            </IconButton>
                        </DialogTitle>
                        <DialogContent>
                            <Box my={2}>
                                <Grid
                                    container
                                    spacing={4}
                                >
                                    <Grid
                                        item
                                        md={7}
                                        xs={12}
                                    >
                                        <Typography gutterBottom>
                                            <strong>{translateType(task?.type)}</strong>,
                                            the
                                            {` `}
                                            {moment(task?.created_at).format('DD/MM')},
                                            at {moment(task?.created_at).format('HH:mm:ss')}
                                        </Typography>

                                        <Typography gutterBottom>
                                            Properties :
                                        </Typography>
                                        <pre>
                                                {JSON.stringify(task?.properties, null, 4)}
                                            </pre>
                                        {task.error && (
                                            <Typography color='error' gutterBottom>
                                                Error : {task.error}
                                            </Typography>
                                        )}
                                    </Grid>
                                    <Grid
                                        item
                                        md={5}
                                        xs={12}
                                    >
                                        <DatasetProvider dataset_id={task?.dataset_id}>
                                            <DatasetConsumer>
                                                {value => <DTDataset dataset={value.dataset}
                                                                     isWorking={value.isWorking}/>}
                                            </DatasetConsumer>
                                        </DatasetProvider>
                                    </Grid>
                                </Grid>
                            </Box>
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </UserProvider>
    )
};

export default TaskDetails;