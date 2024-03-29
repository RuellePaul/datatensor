import React, {FC, useState} from 'react';
import clsx from 'clsx';
import moment from 'moment';
import {useSnackbar} from 'notistack';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Dialog,
    DialogContent,
    InputAdornment,
    Link,
    TextField,
    Typography
} from '@mui/material';
import {Download as DownloadIcon, Downloading as ExportIcon, VisibilityOutlined as ViewIcon} from '@mui/icons-material';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';
import useDataset from 'src/hooks/useDataset';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import api from 'src/utils/api';
import download from 'src/utils/download';
import getDateDiff from 'src/utils/getDateDiff';
import {MIN_LABELS_WARNING_EXPORT} from 'src/config';

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    paper: {
        background: '#191c27',
        padding: 0
    },
    alert: {
        margin: theme.spacing(1, 0, 0),
        alignItems: 'center',
        '& .MuiAlert-message': {
            width: '100%'
        }
    },
    loader: {
        width: '16px !important',
        height: '16px !important'
    },
    wrapper: {
        overflowX: 'hidden',
        overflowY: 'auto'
    }
}));

interface ExportActionProps {
    className?: string;
}

const ExportAction: FC<ExportActionProps> = ({className}) => {
    const classes = useStyles();
    const isMountedRef = useIsMountedRef();
    const {enqueueSnackbar} = useSnackbar();

    const {dataset, saveDataset, categories} = useDataset();

    const [open, setOpen] = useState<boolean>(false);

    const handleOpen = (): void => {
        setOpen(true);
    };

    const handleClose = (): void => {
        setOpen(false);
    };

    const [isExporting, setIsExporting] = useState<boolean>(false);
    const [exportedDataset, setExportedDataset] = useState<object | null>(null);

    const handleExport = async () => {
        try {
            setIsExporting(true);
            const response = await api.get(`/datasets/${dataset.id}/exports/`);
            setExportedDataset(response.data);
            saveDataset(dataset => ({
                ...dataset,
                exported_at: new Date().toISOString()
            }));
        } catch (error) {
            enqueueSnackbar(error.message || 'Something went wrong', {
                variant: 'error'
            });
        } finally {
            setIsExporting(false);
        }
    };

    const handleDownload = filename => {
        if (exportedDataset === null) return;
        download(exportedDataset, `${filename || 'export'}.json`, 'application/json');
    };

    if (!dataset) return null;

    const isPoor =
        categories.map(category => category.labels_count).reduce((acc, val) => acc + val, 0) / categories.length <
        MIN_LABELS_WARNING_EXPORT;

    return (
        <Formik
            initialValues={{
                filename: `export_${dataset.name
                    .replaceAll(' ', '-')
                    .replaceAll(',', '')
                    .toLocaleLowerCase()}`
            }}
            validationSchema={Yup.object().shape({
                filename: Yup.string()
                    .max(255)
                    .required('Filename is required')
            })}
            onSubmit={async (values, {resetForm, setStatus, setSubmitting}) => {
                try {
                    await handleDownload(values.filename);

                    if (isMountedRef.current) {
                        setStatus({success: true});
                        setSubmitting(false);
                        resetForm();
                    }
                } catch (error) {
                    enqueueSnackbar(error.message || 'Something went wrong', {
                        variant: 'error'
                    });

                    if (isMountedRef.current) {
                        setStatus({success: false});
                        setSubmitting(false);
                    }
                }
            }}
        >
            {({errors, handleBlur, handleChange, handleSubmit, touched, values}) => (
                <form noValidate onSubmit={handleSubmit}>
                    <Card className={clsx(classes.root, className)} variant="outlined">
                        <CardContent>
                            <Typography gutterBottom>Export dataset</Typography>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                Download this dataset in JSON format. An exported dataset allows you to use it in your
                                own computer vision pipeline.{' '}
                                <Link
                                    variant="body2"
                                    color="primary"
                                    onClick={() => window.open('/docs/datasets/export', '_blank')}
                                >
                                    Learn more
                                </Link>
                            </Typography>

                            {isPoor && !dataset.exported_at && (
                                <Alert severity="warning" sx={{mt: 2}}>
                                    You don't have enough images in this dataset to successfully converge an object
                                    detection model.
                                    <br />
                                    You must at least get{' '}
                                    <strong>{MIN_LABELS_WARNING_EXPORT} labels per category</strong>
                                </Alert>
                            )}

                            {isExporting && (
                                <Alert className={classes.alert} severity="info">
                                    <Typography variant="body2" component="span">
                                        Please keep this tab open while we're getting done.
                                    </Typography>

                                    <CircularProgress className={classes.loader} />
                                </Alert>
                            )}

                            {dataset.exported_at && !isExporting && (
                                <Alert className={classes.alert}>
                                    <Typography variant="body2">
                                        Last export : {moment(dataset.exported_at).format('DD MMM')} (
                                        {getDateDiff(new Date(), dataset.exported_at, 'passed_event')})
                                    </Typography>

                                    {exportedDataset !== null && (
                                        <>
                                            <TextField
                                                error={Boolean(touched.filename && errors.filename)}
                                                name="filename"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.filename}
                                                autoFocus
                                                margin="dense"
                                                label="Filename"
                                                fullWidth
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">.json</InputAdornment>
                                                }}
                                                variant="standard"
                                            />
                                            <Box display="flex" justifyContent="flex-end" mt={1}>
                                                <Box mr={1}>
                                                    <Button
                                                        color="inherit"
                                                        endIcon={<ViewIcon />}
                                                        onClick={handleOpen}
                                                        size="small"
                                                    >
                                                        Inspect
                                                    </Button>
                                                </Box>
                                                <Button
                                                    color="inherit"
                                                    endIcon={<DownloadIcon />}
                                                    type="submit"
                                                    variant="outlined"
                                                    size="small"
                                                >
                                                    Download
                                                </Button>
                                            </Box>
                                        </>
                                    )}
                                </Alert>
                            )}
                        </CardContent>

                        {exportedDataset === null && (
                            <CardActions style={{justifyContent: 'flex-end'}}>
                                <Button
                                    color="primary"
                                    disabled={isExporting}
                                    endIcon={<ExportIcon />}
                                    onClick={handleExport}
                                    variant="contained"
                                >
                                    Export
                                </Button>
                            </CardActions>
                        )}
                    </Card>

                    <Dialog classes={{paper: classes.paper}} open={open} onClose={handleClose} maxWidth="md">
                        <DialogContent className="scroll">
                            <pre>
                                <code className="language-">
                                    {exportedDataset !== null && JSON.stringify(exportedDataset, null, 3)}
                                </code>
                            </pre>
                        </DialogContent>
                    </Dialog>
                </form>
            )}
        </Formik>
    );
};

export default ExportAction;
