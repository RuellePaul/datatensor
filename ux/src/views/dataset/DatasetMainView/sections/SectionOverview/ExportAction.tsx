import React, {FC, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
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
    LinearProgress,
    Link,
    TextField,
    Typography
} from '@mui/material';
import {Download as DownloadIcon, Downloading as ExportIcon, VisibilityOutlined as ViewIcon} from '@mui/icons-material';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';
import useDataset from 'src/hooks/useDataset';
import useExports from 'src/hooks/useExports';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import useTasks from 'src/hooks/useTasks';
import {Task} from 'src/types/task';
import api from 'src/utils/api';
import download from 'src/utils/download';
import getDateDiff from 'src/utils/getDateDiff';

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    alert: {
        marginTop: theme.spacing(2),
        '& .MuiAlert-message': {
            width: '100%'
        }
    },
    loader: {
        width: '20px !important',
        height: '20px !important'
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

    const {tasks, saveTasks} = useTasks();
    const {dataset, saveDataset} = useDataset();
    const {exports, saveExports, trigger, loading} = useExports();

    const [open, setOpen] = useState<boolean>(false);

    const handleOpen = (): void => {
        setOpen(true);
    };

    const handleClose = (): void => {
        setOpen(false);
    };

    const handleExport = async () => {
        try {
            const response = await api.post<{task: Task}>(`/datasets/${dataset.id}/tasks/`, {
                type: 'export',
                properties: {}
            });
            saveTasks(tasks => [...tasks, response.data.task]);
            saveExports([]);
            saveDataset(dataset => ({
                ...dataset,
                exported_at: new Date().toISOString()
            }));
            trigger(false);
        } catch (error) {
            enqueueSnackbar(error.message || 'Something went wrong', {
                variant: 'error'
            });
        }
    };

    const handleDownload = filename => {
        if (exports.length === 0) return;

        console.log(exports[0].export_data)

        download(exports[0].export_data, `${filename || 'export'}.json`, 'application/json');
    };

    if (!dataset || tasks === null) return null;

    const activeExportTask = tasks.find(
        task =>
            (task.status === 'pending' || task.status === 'active') &&
            task.dataset_id === dataset.id &&
            task.type === 'export'
    );

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
                                own computer vision pipeline. See the{' '}
                                <Link variant="body2" color="primary" component={RouterLink} to="/docs/datasets/export">
                                    dedicated section
                                </Link>{' '}
                                on documentation.
                            </Typography>

                            {dataset.exported_at && !activeExportTask && (
                                <Alert className={classes.alert}>
                                    <Typography variant="body2">
                                        Last export : {moment(dataset.exported_at).format('DD MMM')} (
                                        {getDateDiff(new Date(), dataset.exported_at, 'passed_event')})
                                        <br />
                                        {exports.length === 0 && (
                                            <Link variant="subtitle1" color="primary" onClick={() => trigger(true)}>
                                                View details{' '}
                                                {loading && (
                                                    <CircularProgress className={classes.loader} color="inherit" />
                                                )}
                                            </Link>
                                        )}
                                    </Typography>

                                    {exports.length > 0 && (
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

                            {activeExportTask && (
                                <Box display="flex" alignItems="center">
                                    <Box width="100%" mr={1}>
                                        <LinearProgress
                                            variant={
                                                activeExportTask.progress <= 0 || activeExportTask.progress >= 1
                                                    ? 'query'
                                                    : 'determinate'
                                            }
                                            value={100 * activeExportTask.progress}
                                        />
                                    </Box>
                                    <Typography variant="body2" color="textSecondary">
                                        {`${(100 * activeExportTask.progress).toFixed(2)}%`}
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                        <CardActions style={{justifyContent: 'flex-end'}}>
                            <Button
                                color="primary"
                                disabled={!!activeExportTask}
                                endIcon={
                                    !!activeExportTask ? (
                                        <CircularProgress className={classes.loader} color="inherit" />
                                    ) : (
                                        <ExportIcon />
                                    )
                                }
                                onClick={handleExport}
                                variant="contained"
                            >
                                Export
                            </Button>
                        </CardActions>
                    </Card>

                    <Dialog open={open} onClose={handleClose} maxWidth="md">
                        <DialogContent className="scroll">
                            <pre>
                                <code className="language-">
                                    {exports.length > 0 && JSON.stringify(exports[0].export_data, null, 4)}
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
