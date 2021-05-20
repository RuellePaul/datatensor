import React, {FC, useState} from 'react';
import {
    Box,
    Button,
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
import {SectionProps} from './SectionProps';
import api from 'src/utils/api';
import {Dataset} from 'src/types/dataset';
import {useSnackbar} from 'notistack';
import {Close as CloseIcon} from '@material-ui/icons';
import clsx from 'clsx';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import {useHistory} from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2, 0)
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
    }
}));


const SectionSettings: FC<SectionProps> = ({className}) => {

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
            await api.delete(`/datasets/${dataset._id}`);
            saveDatasets(datasets => datasets.filter((current: Dataset) => current._id !== dataset._id));
            enqueueSnackbar(`Deleted dataset ${dataset.name}`, {variant: 'info'});
            setIsDeleting(false);
            handleCloseDeleteDataset();
            history.push('/app/manage/datasets')
        } catch (error) {
            enqueueSnackbar(error.message || 'Something went wrong', {variant: 'error'});
        }
    }

    return (
        <div className={clsx(classes.root, className)}>
            <Grid container spacing={2}>
                <Grid item sm={6} xs={12}>

                </Grid>
                <Grid item sm={6} xs={12}>
                    <Box mb={2}>
                        <Alert severity="error">
                            <AlertTitle>Dangerous section</AlertTitle>
                            Be careful, actions here can lead to make breaking change <strong>forever</strong>
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
                        Delete dataset | Confirmation
                    </Typography>

                    <IconButton
                        className={classes.close}
                        onClick={handleCloseDeleteDataset}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box my={2}>
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
                                {dataset.image_count} images
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
        </div>
    )
};

export default SectionSettings;
