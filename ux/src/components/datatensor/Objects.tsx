import React, {FC, useState} from 'react';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    makeStyles,
    TextField,
    Typography
} from '@material-ui/core';
import {Close as CloseIcon} from '@material-ui/icons';
import {Formik} from 'formik';
import * as Yup from 'yup';
import api from 'src/utils/api';
import {Theme} from 'src/theme';
import {Object} from 'src/types/object';
import useDataset from 'src/hooks/useDataset';

interface ObjectsProps {

}

const useStyles = makeStyles((theme: Theme) => ({
    objects: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    close: {
        position: 'absolute',
        right: theme.spacing(2),
        top: theme.spacing(2),
        color: theme.palette.grey[500]
    }
}));

const DTObjects: FC<ObjectsProps> = () => {

    const classes = useStyles();

    const {dataset, saveDataset} = useDataset();

    const isMountedRef = useIsMountedRef();

    const [openObjectCreation, setOpenObjectCreation] = useState(false);

    const handleCloseObjectCreation = () => {
        setOpenObjectCreation(false);
    };

    const handleDeleteObject = async (object_id: string) => {
        // TODO : delete object
        console.log(dataset.id, object_id)
    };

    return (
        <>
            <Grid container spacing={2}>
                <Grid item sm={9} xs={12}>
                    <div className={classes.objects}>
                        {dataset.objects.map(object => (
                            <Box
                                m={0.5}
                                key={object.name}
                            >
                                <Chip
                                    color="primary"
                                    label={object.name}
                                    onDelete={() => handleDeleteObject(object.id)}
                                    variant='outlined'
                                />
                            </Box>
                        ))}
                    </div>
                </Grid>
                <Divider flexItem/>
                <Grid item sm={3} xs={12}>
                    <Button
                        color="primary"
                        onClick={() => setOpenObjectCreation(true)}
                        size="small"
                        variant="contained"
                    >
                        New object
                    </Button>
                </Grid>
            </Grid>

            <Dialog
                fullWidth
                maxWidth='sm'
                open={openObjectCreation}
                onClose={handleCloseObjectCreation}
            >
                <DialogTitle
                    className='flex'
                    disableTypography
                >
                    <Typography variant='h4'>
                        Create object
                    </Typography>

                    <IconButton
                        className={classes.close}
                        onClick={handleCloseObjectCreation}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box my={2}>
                        <Formik
                            initialValues={{
                                name: ''
                            }}
                            validationSchema={Yup.object().shape({
                                name: Yup.string().max(255).required('Name is required')
                            })}
                            onSubmit={async (values, {
                                setStatus,
                                setSubmitting
                            }) => {
                                try {
                                    const response = await api.post<Object>(`/v1/objects/`, {dataset_id: dataset.id, ...values});
                                    saveDataset({...dataset, objects: [...dataset.objects, response.data]});

                                    if (isMountedRef.current) {
                                        setStatus({success: true});
                                        setSubmitting(false);
                                    }
                                } catch (error) {
                                    console.error(error);
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
                                  isSubmitting,
                                  touched,
                                  values
                              }) => (
                                <form
                                    noValidate
                                    onSubmit={handleSubmit}
                                >
                                    <TextField
                                        error={Boolean(touched.name && errors.name)}
                                        fullWidth
                                        helperText={touched.name && errors.name}
                                        label="Object name"
                                        margin="normal"
                                        name="name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.name}
                                        variant="outlined"
                                    />
                                    <Box mt={2}>
                                        <Button
                                            color="secondary"
                                            disabled={isSubmitting}
                                            fullWidth
                                            size="large"
                                            type="submit"
                                            variant="contained"
                                        >
                                            Create a new object
                                        </Button>
                                    </Box>
                                </form>
                            )}
                        </Formik>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
};

export default DTObjects;