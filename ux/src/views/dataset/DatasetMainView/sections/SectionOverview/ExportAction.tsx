import React, {FC, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import {useSnackbar} from 'notistack';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Dialog,
    DialogContent,
    Divider,
    InputAdornment,
    LinearProgress,
    Link,
    TextField,
    Typography
} from '@mui/material';
import {Download, VisibilityOutlined as ViewIcon} from '@mui/icons-material';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';
import useDataset from 'src/hooks/useDataset';
import useExports from 'src/hooks/useExports';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import useTasks from 'src/hooks/useTasks';
import api from 'src/utils/api';
import {Task} from 'src/types/task';
import download from 'src/utils/download';

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

const DEFAULT_INPUT_WIDTH = 200;
const MAX_INPUT_WIDTH = 300;
const FONT_SIZE = 8;

const Export: FC<ExportProps> = ({className}) => {
    const classes = useStyles();
    const isMountedRef = useIsMountedRef();
    const {enqueueSnackbar} = useSnackbar();

    const {tasks, saveTasks} = useTasks();
    const {dataset} = useDataset();
    const {exports} = useExports();

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
        } catch (error) {
            enqueueSnackbar(error.message || 'Something went wrong', {
                variant: 'error'
            });
        }
    };

    const handleDownload = filename => {
        if (exports.length === 0) return;

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
                        <CardHeader title="Export" />
                        <CardContent>
                            <Typography gutterBottom>Download your dataset in JSON format.</Typography>
                            <Typography color="textSecondary" gutterBottom>
                                An exported dataset allows you to use it in your own computer vision pipeline. See the{' '}
                                <Link variant="subtitle1" color="primary" component={RouterLink} to="/docs">
                                    dedicated section
                                </Link>{' '}
                                on documentation.
                            </Typography>

                            {activeExportTask ? (
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
                            ) : (
                                <CardActions style={{justifyContent: 'flex-end'}}>
                                    <Button color="primary" onClick={handleExport} variant="contained">
                                        Export
                                    </Button>
                                </CardActions>
                            )}

                            {exports.length > 0 && (
                                <>
                                    <Divider />
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
                                            endAdornment: <InputAdornment position="end">.json</InputAdornment>,
                                            style: {
                                                width: `${
                                                    values.filename.length * FONT_SIZE > DEFAULT_INPUT_WIDTH
                                                        ? Math.min(values.filename.length * FONT_SIZE, MAX_INPUT_WIDTH)
                                                        : DEFAULT_INPUT_WIDTH
                                                }px`
                                            }
                                        }}
                                        variant="standard"
                                    />
                                </>
                            )}
                        </CardContent>

                        {exports.length > 0 && (
                            <CardActions style={{justifyContent: 'flex-end'}}>
                                <Button color="primary" endIcon={<ViewIcon />} onClick={handleOpen} variant="outlined">
                                    Inspect
                                </Button>
                                <Button color="primary" endIcon={<Download />} type="submit" variant="contained">
                                    Download
                                </Button>
                            </CardActions>
                        )}
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

export default Export;
