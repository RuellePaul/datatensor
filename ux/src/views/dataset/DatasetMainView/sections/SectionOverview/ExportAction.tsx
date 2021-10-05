import React, {FC, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import {useSnackbar} from 'notistack';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {
    Alert,
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    InputAdornment,
    Link,
    TextField,
    Typography
} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';
import useDataset from 'src/hooks/useDataset';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
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
    const isMountedRef = useIsMountedRef();
    const {enqueueSnackbar} = useSnackbar();

    const {dataset} = useDataset();

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

    const handleDownload = filename => {
        if (datasetJSON === null) return;

        download(
            datasetJSON,
            `${filename || 'export'}.json`,
            'application/json'
        );
    };

    if (!dataset) return null;

    return (
        <Formik
            initialValues={{
                filename: `export_${dataset.name.replaceAll(' ', '-').replaceAll(',', '').toLocaleLowerCase()}`
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
                        setDatasetJSON(null);
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
            {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                touched,
                values
            }) => (
                <form noValidate onSubmit={handleSubmit}>
                    <Card
                        className={clsx(classes.root, className)}
                        variant="outlined"
                    >
                        <CardContent>
                            <Typography>
                                Export your dataset to{' '}
                                <Link
                                    variant="subtitle1"
                                    color="primary"
                                    component={RouterLink}
                                    to="/docs"
                                >
                                    use it in your code
                                </Link>
                                .
                            </Typography>

                            {datasetJSON === null ? (
                                <>
                                    {isExporting && (
                                        <Alert
                                            severity="warning"
                                            sx={{my: 1}}
                                        >
                                            This might take a while...
                                        </Alert>
                                    )}
                                </>
                            ) : (
                                <>
                                    <TextField
                                        error={Boolean(
                                            touched.filename && errors.filename
                                        )}
                                        name="filename"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.filename}
                                        autoFocus
                                        margin="dense"
                                        label="Filename"
                                        fullWidth
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    .json
                                                </InputAdornment>
                                            )
                                        }}
                                        variant="standard"
                                    />
                                </>
                            )}
                        </CardContent>

                        <CardActions style={{justifyContent: 'flex-end'}}>
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
                                    type="submit"
                                    variant="contained"
                                >
                                    Download
                                </Button>
                            )}
                        </CardActions>
                    </Card>
                </form>
            )}
        </Formik>
    );
};

export default Export;
