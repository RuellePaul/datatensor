import React, {FC, useState} from 'react';
import clsx from 'clsx';
import {useSnackbar} from 'notistack';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Fade,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Typography
} from '@mui/material';
import {
    Close as CloseIcon,
    Delete as DeleteIcon,
    ExpandMore as ArrowDown,
    VisibilityOutlined as ViewIcon
} from '@mui/icons-material';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';
import useDataset from 'src/hooks/useDataset';
import {useDispatch} from 'react-redux';
import {setDefaultPipeline, setPipeline} from 'src/slices/pipeline';
import Pipeline from 'src/components/core/Pipeline';
import useTasks from 'src/hooks/useTasks';
import api from 'src/utils/api';

interface ImagesActionsMenuProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    close: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    },
    loader: {
        width: '20px !important',
        height: '20px !important'
    }
}));

const ViewPipelineMenuItem: FC = () => {
    const classes = useStyles();

    const dispatch = useDispatch();

    const {pipelines} = useDataset();

    const [open, setOpen] = useState(false);

    const pipeline_id = pipelines.length > 0 && pipelines[0].id;

    if (!pipeline_id) return null;

    const handlePipelineOpen = () => {
        if (!pipeline_id) return;

        dispatch(setPipeline(pipelines.find(pipeline => pipeline.id === pipeline_id)));
        setOpen(true);
    };

    const handlePipelineClose = () => {
        setOpen(false);
        dispatch(setDefaultPipeline());
    };
    return (
        <>
            <MenuItem onClick={handlePipelineOpen}>
                <ListItemIcon>
                    <ViewIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit" noWrap>
                    View augmentation pipeline
                </Typography>
            </MenuItem>
            <Divider sx={{my: 0.5}} />
            <Dialog fullWidth maxWidth="xs" open={open} onClose={handlePipelineClose}>
                <DialogTitle className="flex">
                    <Typography variant="h4">Operations pipeline</Typography>

                    <IconButton className={classes.close} onClick={handlePipelineClose} size="large">
                        <CloseIcon fontSize="large" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Pipeline readOnly />
                </DialogContent>
            </Dialog>
        </>
    );
};

const DeletePipelineMenuItem: FC = () => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    const {dataset, saveDataset, pipelines, savePipelines} = useDataset();

    const {tasks} = useTasks();

    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeletePipeline = async () => {
        if (!pipeline_id) return;

        setIsDeleting(true);

        try {
            await api.delete(`/datasets/${dataset.id}/pipelines/${pipeline_id}`);
            saveDataset(dataset => ({
                ...dataset,
                augmented_count:
                    dataset.augmented_count - pipelines.find(pipeline => pipeline.id === pipeline_id).image_count
            }));
            savePipelines(pipelines => pipelines.filter(pipeline => pipeline.id !== pipeline_id));
            enqueueSnackbar(`Deleted pipeline & associated images`, {
                variant: 'info'
            });
        } catch (error) {
            enqueueSnackbar(error.message || 'Something went wrong', {
                variant: 'error'
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const pipeline_id = pipelines.length > 0 && pipelines[0].id;

    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    if (!pipeline_id) return null;

    const activeTasksCount = tasks
        ? tasks.filter(task => task.status === 'active' && task.dataset_id === dataset.id).length
        : 0;

    return (
        <>
            <MenuItem disabled={isDeleting || activeTasksCount > 0} onClick={handleOpen}>
                <ListItemIcon>
                    <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit" noWrap>
                    Delete augmented images ({dataset.augmented_count})
                </Typography>
            </MenuItem>
            <Dialog fullWidth maxWidth="xs" open={open} onClose={handleClose}>
                <DialogTitle className="flex">
                    <Typography variant="h4">Delete augmented images</Typography>

                    <IconButton className={classes.close} onClick={handleClose} size="large">
                        <CloseIcon fontSize="large" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography color="textSecondary">This will delete {dataset.augmented_count} images.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        disabled={isDeleting}
                        endIcon={isDeleting && <CircularProgress className={classes.loader} color="inherit" />}
                        onClick={handleDeletePipeline}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

const ImagesActionsMenu: FC<ImagesActionsMenuProps> = ({className}) => {
    const classes = useStyles();
    const {dataset} = useDataset();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    return (
        <div className={clsx(classes.root, className)}>
            <Button endIcon={<ArrowDown />} onClick={handleClick} size="small">
                Options
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu} TransitionComponent={Fade}>
                <ViewPipelineMenuItem />
                <MenuItem>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit" noWrap>
                        Delete original images ({dataset.image_count})
                    </Typography>
                </MenuItem>
                <DeletePipelineMenuItem />
            </Menu>
        </div>
    );
};

export default ImagesActionsMenu;
