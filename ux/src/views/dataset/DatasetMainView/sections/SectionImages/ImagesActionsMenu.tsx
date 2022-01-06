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
    Tooltip,
    Typography
} from '@mui/material';
import {
    Close as CloseIcon,
    Delete as DeleteIcon,
    BrandingWatermarkOutlined as LabelisatorIcon,
    DynamicFeedOutlined as AugmentationIcon,
    ExpandMore as ArrowDown,
    PublishOutlined as UploadIcon,
    VisibilityOutlined as ViewIcon
} from '@mui/icons-material';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';
import SectionAugmentation from 'src/views/dataset/DatasetMainView/sections/SectionAugmentation';
import useDataset from 'src/hooks/useDataset';
import useImages from 'src/hooks/useImages';
import useTasks from 'src/hooks/useTasks';
import {setDefaultPipeline, setPipeline} from 'src/slices/pipeline';
import ImagesDropzone from 'src/components/ImagesDropzone';
import Pipeline from 'src/components/core/Pipeline';
import api from 'src/utils/api';
import goToHash from '../../../../../utils/goToHash';

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
                    Upload images
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

const LabelisatorMenuItem: FC = () => {
    const {images} = useImages();

    return (
        <MenuItem onClick={() => goToHash(images[0].id, true)}>
            <ListItemIcon>
                <LabelisatorIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit" noWrap>
                Label images
            </Typography>
        </MenuItem>
    );
};

const AugmentationMenuItem: FC = () => {
    const classes = useStyles();

    const {dataset} = useDataset();
    const {images} = useImages();

    const [open, setOpen] = useState<boolean>(false);

    const handleOpenAugmentation = () => setOpen(true);
    const handleCloseAugmentation = () => setOpen(false);

    if (images.length === 0) return null;

    return (
        <>
            {dataset.augmented_count > 0 ? (
                <Tooltip title="You already have augmented images." disableInteractive>
                    <MenuItem
                        component="div"
                        disabled
                        sx={{
                            // @ts-ignore
                            pointerEvents: 'auto !important'
                        }}
                    >
                        <ListItemIcon>
                            <AugmentationIcon fontSize="small" />
                        </ListItemIcon>
                        <Typography variant="inherit" noWrap>
                            Augment images
                        </Typography>
                    </MenuItem>
                </Tooltip>
            ) : (
                <MenuItem onClick={handleOpenAugmentation}>
                    <ListItemIcon>
                        <AugmentationIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit" noWrap>
                        Augment images
                    </Typography>
                </MenuItem>
            )}

            <Dialog open={open} onClose={handleCloseAugmentation} fullWidth maxWidth="lg">
                <DialogTitle>
                    Augment images
                    <IconButton className={classes.close} onClick={handleCloseAugmentation}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <SectionAugmentation />
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

    const {dataset, saveDataset, savePipelines, saveCategories} = useDataset();
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
            saveCategories(categories => categories.map(category => ({...category, labels_count: 0})));
            saveImages([]);
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
                    <Alert severity="error">
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
                <LabelisatorMenuItem />
                <AugmentationMenuItem />
                <ViewPipelineMenuItem />
                <Divider sx={{my: 0.5}} />
                <DeleteImagesMenuItem />
                <DeletePipelineMenuItem />
            </Menu>
        </div>
    );
};

export default ImagesActionsMenu;
