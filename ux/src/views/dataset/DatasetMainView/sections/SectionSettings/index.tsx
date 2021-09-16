import React, {FC, useState} from 'react';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    makeStyles,
    Typography
} from '@material-ui/core';
import {Alert, AlertTitle,} from '@material-ui/lab';
import useDatasets from 'src/hooks/useDatasets';
import {Theme} from 'src/theme';
import useDataset from 'src/hooks/useDataset';
import {SectionProps} from '../SectionProps';
import api from 'src/utils/api';
import {Dataset} from 'src/types/dataset';
import {useSnackbar} from 'notistack';
import {
    Close as CloseIcon,
    DeleteOutline as DeleteIcon,
    Lock as PrivateIcon,
    Public as PublicIcon,
    Visibility as PrivacyIcon
} from '@material-ui/icons';
import clsx from 'clsx';
import {useHistory} from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2, 0)
    },
    privacyAction: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.warning.main,
        '&:hover': {
            backgroundColor: theme.palette.warning.dark
        }

    },
    deleteAction: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.error.main,
        '&:hover': {
            backgroundColor: theme.palette.error.dark
        }
    },
    close: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    },
    loader: {
        width: '20px !important',
        height: '20px !important'
    },
    chip: {
        marginLeft: 6
    }
}));


const SectionSettings: FC<SectionProps> = ({className}) => {

    const classes = useStyles();
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();

    const {saveDatasets} = useDatasets();
    const {dataset, saveDataset, categories} = useDataset();


    const [openDeleteDataset, setOpenDeleteDataset] = useState(false);
    const handleOpenDeleteDataset = () => {
        setOpenDeleteDataset(true);
    };
    const handleCloseDeleteDataset = () => {
        setOpenDeleteDataset(false);
    };

    const [openChangePrivacy, setOpenChangePrivacy] = useState(false);
    const handleOpenChangePrivacy = () => {
        setOpenChangePrivacy(true);
    };
    const handleCloseChangePrivacy = () => {
        setOpenChangePrivacy(false);
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

    const handleChangeDatasetPrivacy = async () => {
        try {
            handleCloseChangePrivacy();
            await api.patch(`/datasets/${dataset.id}/privacy`, {is_public: !dataset.is_public});

            saveDataset({
                ...dataset,
                is_public: !dataset.is_public
            });
        } catch (error) {
            enqueueSnackbar(error.message || 'Something went wrong', {variant: 'error'});
        }
    }

    return (
        <div className={clsx(classes.root, className)}>
            <Grid container spacing={2}>
                <Grid item sm={6} xs={12}>
                    <Box mb={2}>
                        <Alert severity="warning">
                            <AlertTitle>Change privacy</AlertTitle>
                            Be careful, a public dataset is visible by any user of Datatensor.
                            <br/>
                            This dataset is currently <strong>{dataset.is_public ? 'public' : 'private'}</strong>
                        </Alert>
                    </Box>

                    <Button
                        className={classes.privacyAction}
                        onClick={handleOpenChangePrivacy}
                        startIcon={<PrivacyIcon/>}
                        variant="contained"
                    >
                        Change privacy
                    </Button>
                </Grid>

                <Grid item sm={6} xs={12}>
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

                </Grid>
            </Grid>

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
                    <Box my={1}>
                        <Typography color='textPrimary' gutterBottom>
                            Are you sure you want to delete dataset {dataset.name} ?
                        </Typography>
                        <Alert severity="warning">
                            <AlertTitle>
                                Warning
                            </AlertTitle>
                            This will delete
                            {' '}
                            <Typography component='span' style={{fontWeight: 'bold'}}>
                                {dataset.image_count} image{dataset.image_count > 1 ? 's' : ''}
                                {' '}
                                (+ {dataset.augmented_count} augmented image{dataset.augmented_count > 1 ? 's' : ''})
                            </Typography>
                            , and
                            {' '}
                            <Typography component='span' style={{fontWeight: 'bold'}}>
                                {categories.length} categories
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
                            {isDeleting ? 'Deleting dataset' : 'Yes, go ahead'}
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>

            <Dialog
                disableRestoreFocus
                fullWidth
                open={openChangePrivacy}
                onClose={handleCloseChangePrivacy}
            >
                <DialogTitle
                    className='flex'
                    disableTypography
                >
                    <Typography variant='h4'>
                        Change privacy
                    </Typography>

                    <IconButton
                        className={classes.close}
                        onClick={handleCloseChangePrivacy}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box my={1}>
                        <Typography color='textPrimary' gutterBottom>
                            This dataset is currently :

                            <Chip
                                className={classes.chip}
                                label={dataset.is_public ? 'Public' : 'Private'}
                                icon={dataset.is_public ? <PublicIcon/> : <PrivateIcon/>}
                                variant='outlined'
                            />
                        </Typography>

                        <Button
                            onClick={handleChangeDatasetPrivacy}
                            variant="contained"
                        >
                            {dataset.is_public ? 'Make private' : 'Make public'}
                        </Button>

                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    )
};

export default SectionSettings;
