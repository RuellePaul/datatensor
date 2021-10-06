import React, {FC, useState} from 'react';
import clsx from 'clsx';
import {useSnackbar} from 'notistack';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Box, Button, CircularProgress, IconButton, Paper, TextField, Typography} from '@mui/material';
import {CreateOutlined as EditIcon} from '@mui/icons-material';
import {makeStyles} from '@mui/styles';
import {Theme} from 'src/theme';
import QuillEditor from 'src/components/QuillEditor';
import useDataset from 'src/hooks/useDataset';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import api from 'src/utils/api';


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        background: theme.palette.background.default
    },
    loader: {
        width: '20px !important',
        height: '20px !important'
    },
    editor: {
        '& .ql-editor': {
            height: 400
        }
    }
}));

interface EditProps {
    className?: string;
}

const EditAction: FC<EditProps> = ({ className }) => {
    const classes = useStyles();
    const isMountedRef = useIsMountedRef();
    const { enqueueSnackbar } = useSnackbar();

    const [editing, setEditing] = useState<boolean>(false);

    const { dataset, saveDataset } = useDataset();

    if (!dataset) return null;

    if (!editing) {
        return (
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <div>
                    <Typography variant="h1" color="textPrimary" gutterBottom>
                        {dataset.name}
                    </Typography>

                    <Typography
                        color="textSecondary"
                        variant="body2"
                        dangerouslySetInnerHTML={{
                            __html: (dataset.description !== '<p><br></p>')
                                ? dataset.description
                                : '<i>No description provided</i>'
                        }}
                    />
                </div>
                <IconButton onClick={() => setEditing(true)}>
                    <EditIcon />
                </IconButton>
            </Box>
        );
    }

    return (
        <Formik
            initialValues={{
                name: dataset.name,
                description: dataset.description || ''
            }}
            validationSchema={Yup.object().shape({
                name: Yup.string()
                    .max(255)
                    .required('Filename is required'),
                description: Yup.string().max(5000)
            })}
            onSubmit={async (values, { setStatus, setSubmitting }) => {
                try {
                    try {
                        await api.patch(`/datasets/${dataset.id}`, {
                            name: values.name,
                            description: values.description
                        });
                        saveDataset(dataset => ({
                            ...dataset,
                            ...values
                        }));
                        setEditing(false);
                        enqueueSnackbar('Edited dataset', { variant: 'success' });
                    } catch (error) {
                        enqueueSnackbar(error.message || 'Something went wrong', { variant: 'error' });
                    }

                    if (isMountedRef.current) {
                        setStatus({ success: true });
                        setSubmitting(false);
                    }
                } catch (error) {
                    enqueueSnackbar(error.message || 'Something went wrong', {
                        variant: 'error'
                    });

                    if (isMountedRef.current) {
                        setStatus({ success: false });
                        setSubmitting(false);
                    }
                }
            }}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, touched, isSubmitting, values, setFieldValue }) => (
                <form noValidate onSubmit={handleSubmit}>
                    <div className={clsx(classes.root, className)}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Name
                        </Typography>
                        <TextField
                            error={Boolean(touched.name && errors.name)}
                            name="name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.name}
                            autoFocus
                            margin="dense"
                            fullWidth
                            variant="filled"
                            size="small"
                            hiddenLabel
                        />
                        <Box my={2}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Description
                            </Typography>
                        </Box>
                        <Paper variant="outlined">
                            <QuillEditor
                                className={classes.editor}
                                value={values.description}
                                onChange={(value: string) => setFieldValue('description', value)}
                            />
                        </Paper>

                        <Box mt={2} display="flex" alignItems="center" justifyContent="flex-end">
                            <Box mr={1}>
                                <Button onClick={() => setEditing(false)} size="small">
                                    Cancel
                                </Button>
                            </Box>

                            <Button
                                color="primary"
                                disabled={isSubmitting}
                                endIcon={
                                    isSubmitting ? (
                                        <CircularProgress className={classes.loader} color="inherit" />
                                    ) : (
                                        <EditIcon />
                                    )
                                }
                                size="small"
                                type="submit"
                                variant="contained"
                            >
                                Edit
                            </Button>
                        </Box>
                    </div>
                </form>
            )}
        </Formik>
    );
};

export default EditAction;
