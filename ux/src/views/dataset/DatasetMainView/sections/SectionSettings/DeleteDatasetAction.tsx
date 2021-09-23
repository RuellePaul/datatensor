import React, {FC, useState} from 'react';
import {useHistory} from 'react-router-dom';
import clsx from 'clsx';
import {useSnackbar} from 'notistack';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    makeStyles,
    Typography
} from '@material-ui/core';
import {Close as CloseIcon, DeleteOutline as DeleteIcon} from '@material-ui/icons';
import {Alert, AlertTitle} from '@material-ui/lab';
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
    },
}));

interface ChangeNameActionProps {
    className?: string
}

const ChangeNameAction: FC<ChangeNameActionProps> = ({className}) => {

    const classes = useStyles();
    const history = useHistory();

    const {enqueueSnackbar} = useSnackbar();

    const {saveDatasets} = useDatasets();
    const {dataset, categories} = useDataset();

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
            enqueueSnackbar(`Deleted dataset ${dataset.name}`, {variant: 'info'});
            history.push('/app/datasets')
        } catch (error) {
            enqueueSnackbar(error.message || 'Something went wrong', {variant: 'error'});
        } finally {
            setIsDeleting(false);
        }
    }

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
                startIcon={<DeleteIcon/>}
                endIcon={isDeleting && (
                    <CircularProgress
                        className={classes.loader}
                        color="inherit"
                    />
                )}
                disabled={isDeleting}
                variant="contained"
            >
                Delete dataset
            </Button>

            <Dialog
                disableRestoreFocus
                fullWidth
                open={openDeleteDataset}
                onClose={handleCloseDeleteDataset}
            >
                <DialogTitle
                    className='flex'
                    disableTypography
                >
                    <Typography variant='h4'>
                        Delete dataset
                    </Typography>

                    <IconButton
                        className={classes.close}
                        onClick={handleCloseDeleteDataset}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography
                        color='textPrimary'
                        gutterBottom
                    >
                        You're about to delete, <strong>definitely</strong> this dataset.
                    </Typography>
                    <Box mb={2}>
                        <Alert severity="warning">
                            This will also delete
                            {' '}
                            <Typography component='span' style={{fontWeight: 'bold'}}>
                                {dataset.image_count + dataset.augmented_count} image{dataset.image_count > 1 ? 's' : ''}
                            </Typography>
                            ,
                            {' '}
                            <Typography component='span' style={{fontWeight: 'bold'}}>
                                {categories.length} categories
                            </Typography>
                            , and
                            {' '}
                            <Typography component='span' style={{fontWeight: 'bold'}}>
                                {categories.map(category => category.labels_count).reduce((acc, val) => acc + val, 0)} labels
                            </Typography>
                        </Alert>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Box display='flex' justifyContent='flex-end'>
                        <Button
                            className={classes.deleteAction}
                            onClick={handleDeleteDataset}
                            startIcon={<DeleteIcon/>}
                            endIcon={isDeleting && (
                                <CircularProgress
                                    className={classes.loader}
                                    color="inherit"
                                />
                            )}
                            disabled={isDeleting}
                            variant="contained"
                        >
                            Delete
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </div>
    )
};

export default ChangeNameAction;