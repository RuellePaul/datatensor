import React, {FC, useState} from 'react';
import {useDispatch} from 'react-redux';
import clsx from 'clsx';
import {useSnackbar} from 'notistack';
import {
    Alert,
    AlertTitle,
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
    PublishOutlined as UploadIcon,
    VisibilityOutlined as ViewIcon
} from '@mui/icons-material';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';
import useDataset from 'src/hooks/useDataset';
import useImages from 'src/hooks/useImages';
import useTasks from 'src/hooks/useTasks';
import {setDefaultPipeline, setPipeline} from 'src/slices/pipeline';
import ImagesDropzone from 'src/components/ImagesDropzone';
import Pipeline from 'src/components/core/Pipeline';
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

const UploadMenuItem: FC = () => {
    const classes = useStyles();

    const [open, setOpen] = useState(false);

    const handleOpenUpload = () => setOpen(true);
    const handleCloseUpload = () => setOpen(false);

    return (
        <>
            <MenuItem onClick={handleOpenUpload}>
                <ListItemIcon>
                    <UploadIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit" noWrap>
                    Upload images
                </Typography>
            </MenuItem>
            <Dialog open={open} onClose={handleCloseUpload}>
                <DialogTitle>
                    Upload Images
                    <IconButton className={classes.close} onClick={handleCloseUpload}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <ImagesDropzone callback={handleCloseUpload} />
                </DialogContent>
            </Dialog>
        </>
    );
};

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
            <Dialog fullWidth maxWidth="xs" open={open} onClose={handlePipelineClose}>
                <DialogTitle>
                    Operations pipeline
                    <IconButton className={classes.close} onClick={handlePipelineClose}>
                        <CloseIcon />
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
                augmented_count: 0
            }));
            savePipelines(pipelines => pipelines.filter(pipeline => pipeline.id !== pipeline_id));
            enqueueSnackbar(`Deleted augmented images`, {
                variant: 'info'
            });
            handleClose();
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
                    Delete augmented images
                </Typography>
            </MenuItem>
            <Dialog fullWidth maxWidth="xs" open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete augmented images
                    <IconButton className={classes.close} onClick={handleClose}>
                        <CloseIcon />
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

const DeleteImagesMenuItem: FC = () => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    const {dataset, saveDataset, savePipelines} = useDataset();
    const {images, saveImages} = useImages();

    const {tasks} = useTasks();

    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteImages = async () => {
        setIsDeleting(true);

        try {
            await api.delete(`/datasets/${dataset.id}/images/`);
            saveDataset(dataset => ({
                ...dataset,
                image_count: 0,
                augmented_count: 0
            }));
            saveImages(null);
            savePipelines([]);
            enqueueSnackbar(`Deleted all images`, {
                variant: 'info'
            });
            handleClose();
        } catch (error) {
            enqueueSnackbar(error.message || 'Something went wrong', {
                variant: 'error'
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const activeTasksCount = tasks
        ? tasks.filter(task => task.status === 'active' && task.dataset_id === dataset.id).length
        : 0;

    return (
        <>
            <MenuItem
                disabled={isDeleting || activeTasksCount > 0 || images === null || images.length === 0}
                onClick={handleOpen}
            >
                <ListItemIcon>
                    <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit" noWrap>
                    Delete all images
                </Typography>
            </MenuItem>
            <Dialog fullWidth maxWidth="xs" open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete all images
                    <IconButton className={classes.close} onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>
                        This will delete {dataset.image_count + dataset.augmented_count} images.
                    </Typography>
                    <Alert severity='error'>
                        <AlertTitle>There is no way back</AlertTitle>
                        Your images and associated data (labels, categories...) will be deleted <strong>forever</strong>
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button
                        disabled={isDeleting}
                        endIcon={isDeleting && <CircularProgress className={classes.loader} color="inherit" />}
                        onClick={handleDeleteImages}
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
                Actions
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu} TransitionComponent={Fade}>
                <UploadMenuItem />
                <ViewPipelineMenuItem />
                <Divider sx={{my: 0.5}} />
                <DeleteImagesMenuItem />
                <DeletePipelineMenuItem />
            </Menu>
        </div>
    );
};

export default ImagesActionsMenu;
