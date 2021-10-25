import React, {FC, useState} from 'react';
import clsx from 'clsx';
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
    LinearProgress,
    Link,
    Typography
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {Close as CloseIcon} from '@mui/icons-material';
import {Theme} from 'src/theme';
import {TaskAugmentorProperties, TaskGeneratorProperties, TaskStatus} from 'src/types/task';
import {UserConsumer, UserProvider} from 'src/store/UserContext';
import {DatasetConsumer, DatasetProvider} from 'src/store/DatasetContext';
import useTasks from 'src/hooks/useTasks';
import DTDataset from 'src/components/core/Dataset';
import FancyLabel from 'src/components/FancyLabel';
import UserLabel from 'src/components/UserLabel';
import getDateDiff from 'src/utils/getDateDiff';
import {MAX_CATEGORIES_DISPLAYED} from 'src/config';


interface TaskDetailsProps {}

interface TaskStatusProps {
    status: TaskStatus;
}

interface GeneratorProperties {
    properties: TaskGeneratorProperties;
}

interface AugmentorProperties {
    properties: TaskAugmentorProperties;
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
            margin: theme.spacing(0.5, 0.5, 0.5, 0)
        }
    },
    link: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: theme.spacing(1)
    },
    block: {
        display: 'block',
        marginTop: theme.spacing(2)
    }
}));

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

export const TaskStatusLabel: FC<TaskStatusProps> = ({status}) => {
    return (
        <FancyLabel className={clsx(['pending', 'active'].includes(status) && 'blinking')} color={colorReducer(status)}>
            {status}
        </FancyLabel>
    );
};

const GeneratorProperties: FC<GeneratorProperties> = ({properties}) => {
    const classes = useStyles();

    const [expand, setExpand] = useState<boolean>(false);

    return (
        <>
            <Typography color="textPrimary" gutterBottom>
                Generate <strong>{properties.image_count}</strong> images from{' '}
                <strong>
                    {properties.selected_categories.length}
                    {properties.selected_categories.length > 1 ? ' categories' : ' category'}
                </strong>{' '}
                (datasource <strong>{properties.datasource_key}</strong>) :
            </Typography>
            <div className={classes.chips}>
                {expand ? (
                    <>
                        {properties.selected_categories.map(category => (
                            <Chip label={capitalize(category)} variant="outlined" />
                        ))}
                    </>
                ) : (
                    <>
                        {properties.selected_categories.slice(0, MAX_CATEGORIES_DISPLAYED).map(category => (
                            <Chip label={capitalize(category)} variant="outlined" />
                        ))}
                        {properties.selected_categories.length > MAX_CATEGORIES_DISPLAYED && (
                            <Link
                                className={classes.link}
                                onClick={() => {
                                    setExpand(true);
                                }}
                            >
                                and {properties.selected_categories.length - MAX_CATEGORIES_DISPLAYED} more...
                            </Link>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

const AugmentorProperties: FC<AugmentorProperties> = ({properties}) => {
    return (
        <>
            <Typography color="textPrimary" gutterBottom>
                Augmentation up to <strong>{properties.image_count}</strong> images
            </Typography>
        </>
    );
};

const TaskDetails: FC<TaskDetailsProps> = () => {
    const classes = useStyles();

    const {selectedTask: task, saveSelectedTask} = useTasks();

    const handleClose = () => {
        saveSelectedTask(null);
    };

    return (
        <UserProvider user_id={task?.user_id}>
            <Dialog
                closeAfterTransition
                disableRestoreFocus
                PaperProps={{
                    className: classes.dialog
                }}
                fullWidth
                maxWidth="sm"
                open={task !== null}
                onClose={handleClose}
            >
                {task && (
                    <>
                        <DialogTitle>
                            <Typography>{capitalize(task.type)}</Typography>

                            <IconButton className={classes.close} onClick={handleClose} size="large">
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent className="scroll">
                            {(task.status === 'pending' || task.status === 'active') && (
                                <Box display="flex" alignItems="center">
                                    <Box width="100%" mr={1}>
                                        <LinearProgress
                                            variant={
                                                (task.progress <= 0 || task.progress) >= 1 ? 'query' : 'determinate'
                                            }
                                            value={100 * task.progress}
                                        />
                                    </Box>
                                    <Typography variant="body2" color="textSecondary">
                                        {`${(100 * task.progress).toFixed(2)}%`}
                                    </Typography>
                                </Box>
                            )}
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="overline" color="inherit" gutterBottom>
                                        Task
                                    </Typography>
                                    {task.type === 'generator' && (
                                        <GeneratorProperties properties={task.properties as TaskGeneratorProperties} />
                                    )}
                                    {task.type === 'augmentor' && (
                                        <AugmentorProperties properties={task.properties as TaskAugmentorProperties} />
                                    )}
                                    <Box mt={2}>
                                        <Divider />
                                    </Box>
                                </Grid>
                                <Grid item sm={5} xs={12}>
                                    <Typography variant="overline" color="inherit" gutterBottom>
                                        Created by
                                    </Typography>
                                    <UserConsumer>
                                        {value => (
                                            <UserLabel user={value.user}>
                                                <Typography variant="caption" color="textSecondary">
                                                    {getDateDiff(new Date(), task.created_at, 'passed_event')}
                                                </Typography>
                                            </UserLabel>
                                        )}
                                    </UserConsumer>

                                    <Typography
                                        className={classes.block}
                                        variant="overline"
                                        color="inherit"
                                        gutterBottom
                                    >
                                        Status
                                    </Typography>
                                    <TaskStatusLabel status={task.status} />
                                </Grid>
                                <Grid item sm={7} xs={12}>
                                    <Typography variant="overline" color="inherit" gutterBottom>
                                        Dataset
                                    </Typography>

                                    <DatasetProvider dataset_id={task?.dataset_id}>
                                        <DatasetConsumer>
                                            {value => <DTDataset dataset={value.dataset} />}
                                        </DatasetConsumer>
                                    </DatasetProvider>
                                </Grid>
                            </Grid>
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </UserProvider>
    );
};

export default TaskDetails;
