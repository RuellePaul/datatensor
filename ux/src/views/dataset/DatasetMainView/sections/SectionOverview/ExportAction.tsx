import React, {FC, useState} from 'react';
import clsx from 'clsx';
import {useSnackbar} from 'notistack';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography
} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';
import useDataset from 'src/hooks/useDataset';
import api from 'src/utils/api';
import download from 'src/utils/download';
import {Download} from '@mui/icons-material';

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    loader: {
        width: '20px !important',
        height: '20px !important'
    },
    wrapper: {
        overflowX: 'hidden',
        overflowY: 'auto'
    }
}));

interface ExportProps {
    className?: string;
}

const Export: FC<ExportProps> = ({className}) => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    const {dataset} = useDataset();

    const [open, setOpen] = useState<boolean>(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [isExporting, setIsExporting] = useState<boolean>(false);

    const [datasetJSON, setDatasetJSON] = useState<string | null>(null);

    const handleExport = async () => {
        setIsExporting(true);

        try {
            const response = await api.get(`/datasets/${dataset.id}/export/`);
            setDatasetJSON(response.data);
        } catch (error) {
            enqueueSnackbar(error.message || 'Something went wrong', {
                variant: 'error'
            });
        } finally {
            setIsExporting(false);
        }
    };

    const handleDownload = () => {
        if (datasetJSON === null) return;

        download(datasetJSON, `${dataset.name}.json`, 'application/json');
        handleClose();
    };

    if (!dataset) return null;

    return (
        <Card className={clsx(classes.root, className)} variant="outlined">
            <CardContent>
                <Typography color="textPrimary" gutterBottom>
                    Export your dataset to .json
                </Typography>
            </CardContent>

            <CardActions style={{justifyContent: 'flex-end'}}>
                <Button
                    color="primary"
                    onClick={handleOpen}
                    variant="contained"
                >
                    Export
                </Button>
            </CardActions>

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth={datasetJSON === null ? 'sm': 'lg'}
            >
                <DialogTitle>Export</DialogTitle>
                <DialogContent>
                    {datasetJSON === null ? (
                        <>
                            <DialogContentText>
                                To subscribe to this website, please enter your
                                email address here. We will send updates
                                occasionally.
                            </DialogContentText>
                        </>
                    ) : (
                        <>
                            <pre className={clsx(classes.wrapper, 'scroll')}>
                                <code className="language-sh">
                                    {JSON.stringify(JSON.parse(datasetJSON), null, 4)}
                                </code>
                            </pre>
                            <DialogContentText>
                                To subscribe to this website, please enter your
                                email address here. We will send updates
                                occasionally.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Email Address"
                                type="email"
                                fullWidth
                                variant="standard"
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    {datasetJSON === null ? (
                        <Button
                            color="primary"
                            disabled={isExporting}
                            endIcon={
                                isExporting && (
                                    <CircularProgress
                                        className={classes.loader}
                                        color="inherit"
                                    />
                                )
                            }
                            onClick={handleExport}
                            variant="contained"
                        >
                            Export
                        </Button>
                    ) : (
                        <Button
                            color="primary"
                            endIcon={<Download />}
                            onClick={handleDownload}
                            variant="contained"
                        >
                            Download
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default Export;
