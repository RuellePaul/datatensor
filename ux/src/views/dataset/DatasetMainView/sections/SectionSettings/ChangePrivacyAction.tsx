import React, {FC, useState} from 'react';
import clsx from 'clsx';
import {useSnackbar} from 'notistack';
import {
    Alert,
    AlertTitle,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography
} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {
    Close as CloseIcon,
    Lock as PrivateIcon,
    Public as PublicIcon,
    Visibility as PrivacyIcon
} from '@mui/icons-material';
import api from 'src/utils/api';
import {Theme} from 'src/theme';
import useDataset from 'src/hooks/useDataset';

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    chip: {
        marginLeft: 6
    },
    privacyAction: {
        color: theme.palette.warning.main,
        borderColor: theme.palette.warning.main
    },
    close: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    }
}));

interface ChangePrivacyActionProps {
    className?: string;
}

const ChangePrivacyAction: FC<ChangePrivacyActionProps> = ({className}) => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    const {dataset, saveDataset} = useDataset();

    const [openChangePrivacy, setOpenChangePrivacy] = useState(false);
    const handleOpenChangePrivacy = () => {
        setOpenChangePrivacy(true);
    };
    const handleCloseChangePrivacy = () => {
        setOpenChangePrivacy(false);
    };

    const handleChangeDatasetPrivacy = async () => {
        try {
            handleCloseChangePrivacy();
            await api.patch(`/datasets/${dataset.id}/privacy`, {
                is_public: !dataset.is_public
            });

            saveDataset({
                ...dataset,
                is_public: !dataset.is_public
            });
        } catch (error) {
            enqueueSnackbar(error.message || 'Something went wrong', {
                variant: 'error'
            });
        }
    };

    return (
        <div className={clsx(classes.root, className)}>
            <Box mb={2}>
                <Alert severity="warning">
                    <AlertTitle>Change privacy</AlertTitle>
                    Be careful, a public dataset is visible by any user of
                    Datatensor.
                    <br />
                    This dataset is currently{' '}
                    <strong>{dataset.is_public ? 'public' : 'private'}</strong>
                </Alert>
            </Box>

            <Button
                className={classes.privacyAction}
                onClick={handleOpenChangePrivacy}
                startIcon={<PrivacyIcon />}
                variant="outlined"
            >
                Change privacy
            </Button>

            <Dialog
                disableRestoreFocus
                fullWidth
                open={openChangePrivacy}
                onClose={handleCloseChangePrivacy}
            >
                <DialogTitle className="flex">
                    <Typography variant="h4">Change privacy</Typography>

                    <IconButton
                        className={classes.close}
                        onClick={handleCloseChangePrivacy}
                        size="large"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box my={1}>
                        <Typography color="textPrimary" gutterBottom>
                            This dataset is currently :
                            <Chip
                                className={classes.chip}
                                label={dataset.is_public ? 'Public' : 'Private'}
                                icon={
                                    dataset.is_public ? (
                                        <PublicIcon />
                                    ) : (
                                        <PrivateIcon />
                                    )
                                }
                                variant="outlined"
                            />
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={handleChangeDatasetPrivacy}
                        variant="contained"
                    >
                        {dataset.is_public ? 'Make private' : 'Make public'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ChangePrivacyAction;
