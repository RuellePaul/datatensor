import React, {FC, useState} from 'react';
import {useHistory} from 'react-router-dom';
import clsx from 'clsx';
import {useSnackbar} from 'notistack';
import {
    Alert,
    AlertTitle,
    Box,
    Button,
    capitalize,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography
} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {Close as CloseIcon, DeleteOutline as DeleteIcon} from '@mui/icons-material';
import api from 'src/utils/api';
import {Theme} from 'src/theme';
import useDataset from 'src/hooks/useDataset';
import {Dataset} from 'src/types/dataset';
import useDatasets from 'src/hooks/useDatasets';


const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    deleteAction: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.error.main,
        '&:hover': {
            backgroundColor: theme.palette.error.dark
        }
    },
    loader: {
        width: '20px !important',
        height: '20px !important'
    },
    close: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    }
}));

interface ChangeNameActionProps {
    className?: string;
}

const ChangeNameAction: FC<ChangeNameActionProps> = ({ className }) => {
    const classes = useStyles();
    const history = useHistory();

    const { enqueueSnackbar } = useSnackbar();

    const { saveDatasets } = useDatasets();
    const { dataset, categories } = useDataset();

    const [openDeleteDataset, setOpenDeleteDataset] = useState(false);
    const handleOpenDeleteDataset = () => {
        setOpenDeleteDataset(true);
    };
    const handleCloseDeleteDataset = () => {
        setOpenDeleteDataset(false);
    };

    const [isDeleting, setIsDeleting] = useState(false);
    const handleDeleteDataset = async () => {
        setIsDeleting(true);
        try {
            handleCloseDeleteDataset();
            await api.delete(`/datasets/${dataset.id}`);
            saveDatasets(datasets => datasets.filter((current: Dataset) => current.id !== dataset.id));
            enqueueSnackbar(`Deleted dataset ${capitalize(dataset.name)}`, { variant: 'info' });
            history.push('/datasets');
        } catch (error) {
            enqueueSnackbar(error.message || 'Something went wrong', {
                variant: 'error'
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className={clsx(classes.root, className)}>
            <Box mb={2}>
                <Alert severity="error">
                    <AlertTitle>Delete dataset</AlertTitle>
                    Be careful, once deleted, there is no going back. <strong>It will be lost forever</strong>
                </Alert>
            </Box>

            <Button
                className={classes.deleteAction}
                onClick={handleOpenDeleteDataset}
                startIcon={<DeleteIcon />}
                endIcon={isDeleting && <CircularProgress className={classes.loader} color="inherit" />}
                disabled={isDeleting}
                variant="contained"
            >
                Delete dataset
            </Button>

            <Dialog disableRestoreFocus fullWidth open={openDeleteDataset} onClose={handleCloseDeleteDataset}>
                <DialogTitle>
                    Delete dataset
                    <IconButton className={classes.close} onClick={handleCloseDeleteDataset} size="large">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography color="textPrimary" gutterBottom>
                        Are you sure you want to delete <strong>definitely</strong> this dataset ?
                    </Typography>
                    {dataset.image_count > 0 && categories.length > 0 && (
                        <Box mb={2}>
                            <Alert severity="warning">
                                This will also delete{' '}
                                <Typography component="span" style={{ fontWeight: 'bold' }}>
                                    {dataset.image_count + dataset.augmented_count} image
                                    {dataset.image_count > 1 ? 's' : ''}
                                </Typography>
                                ,{' '}
                                <Typography component="span" style={{ fontWeight: 'bold' }}>
                                    {categories.length} categories
                                </Typography>
                                , and{' '}
                                <Typography component="span" style={{ fontWeight: 'bold' }}>
                                    {categories
                                        .map(category => category.labels_count)
                                        .reduce((acc, val) => acc + val, 0)}{' '}
                                    labels
                                </Typography>
                            </Alert>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Box display="flex" justifyContent="flex-end">
                        <Button
                            className={classes.deleteAction}
                            onClick={handleDeleteDataset}
                            startIcon={<DeleteIcon />}
                            endIcon={isDeleting && <CircularProgress className={classes.loader} color="inherit" />}
                            disabled={isDeleting}
                            variant="contained"
                        >
                            Delete
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ChangeNameAction;
