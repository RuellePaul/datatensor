import React, {FC, useState} from 'react';
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
import {TaskGeneratorProperties, TaskStatus} from 'src/types/task';
import {UserConsumer, UserProvider} from 'src/store/UserContext';
import {DatasetConsumer, DatasetProvider} from 'src/store/DatasetContext';
import useTasks from 'src/hooks/useTasks';
import FancyLabel from 'src/components/FancyLabel';
import UserLabel from 'src/components/UserLabel';
import getDateDiff from 'src/utils/getDateDiff';
import DTDataset from './Dataset';

interface TaskDetailsProps {

}

interface TaskStatusProps {
    status: TaskStatus
}

interface GeneratorProperties {
    properties: TaskGeneratorProperties
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

const GeneratorProperties: FC<GeneratorProperties> = ({properties}) => {

    const classes = useStyles();

    const [expand, setExpand] = useState(false);

    return (
        <>
            <Typography
                color='textPrimary'
                gutterBottom
            >
                Generate <strong>{properties.image_count}</strong> images from
                {' '}
                <strong>
                    {properties.selected_categories.length}
                    {properties.selected_categories.length > 1
                        ? ' categories'
                        : ' category'
                    }
                </strong> (datasource <strong>{properties.datasource_key}</strong>) :
            </Typography>
            <div className={classes.chips}>
                {expand
                    ? (
                        <>
                            {properties.selected_categories.map(category => (
                                <Chip
                                    label={capitalize(category)}
                                    variant='outlined'
                                />
                            ))}
                        </>
                    ) : (
                        <>
                            {properties.selected_categories.slice(0, 18).map(category => (
                                <Chip
                                    label={capitalize(category)}
                                    variant='outlined'
                                />
                            ))}
                            {properties.selected_categories.length > 18 && (
                                <Link
                                    className={classes.link}
                                    onClick={() => {
                                        setExpand(true)
                                    }}
                                >
                                    and {properties.selected_categories.length - 18} more...
                                </Link>
                            )}
                        </>
                    )}
            </div>
        </>
    )
};

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
                                    {'  '}
                                    <TaskStatusLabel status={task.status}/>
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
                                    sm={4}
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
                                    sm={8}
                                    xs={12}
                                >
                                    <Typography
                                        variant="overline"
                                        color="inherit"
                                        gutterBottom
                                    >
                                        Dataset
                                    </Typography>

                                    <DatasetProvider dataset_id={task?.dataset_id}>
                                        <DatasetConsumer>
                                            {value => (
                                                <DTDataset
                                                    dataset={value.dataset}
                                                />
                                            )}
                                        </DatasetConsumer>
                                    </DatasetProvider>
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
                                            <GeneratorProperties properties={task.properties}/>
                                        )
                                    }

                                </Grid>
                            </Grid>
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </UserProvider>
    )
};

export default TaskDetails;