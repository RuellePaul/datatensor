import React, {FC, useState} from 'react';
import {useSnackbar} from 'notistack';

import {Formik} from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Button,
    capitalize,
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {Add as AddIcon, CategoryOutlined as CategoriesIcon, Close as CloseIcon} from '@mui/icons-material';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import api from 'src/utils/api';
import {Theme} from 'src/theme';
import {Category} from 'src/types/category';
import useDataset from 'src/hooks/useDataset';
import {SUPERCATEGORIES, SUPERCATEGORIES_ICONS} from 'src/config';

interface AddCategoryActionProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    select: {
        display: 'flex'
    },
    close: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    }
}));

const AddCategoryAction: FC<AddCategoryActionProps> = ({className}) => {
    const classes = useStyles();
    const isMountedRef = useIsMountedRef();

    const {enqueueSnackbar} = useSnackbar();

    const {dataset, categories, saveCategories} = useDataset();

    const [openCategoryCreation, setOpenCategoryCreation] = useState(false);

    const handleCloseCategoryCreation = () => {
        setOpenCategoryCreation(false);
    };

    return (
        <>
            <Box mr={1} mb={1}>
                <Chip
                    label="New category"
                    icon={<AddIcon />}
                    onClick={() => setOpenCategoryCreation(true)}
                    variant="outlined"
                />
            </Box>

            <Dialog fullWidth maxWidth="sm" open={openCategoryCreation} onClose={handleCloseCategoryCreation}>
                <DialogTitle className="flex">
                    <Box mr={1}>
                        <CategoriesIcon />
                    </Box>

                    <Typography variant="h4">Add a new category</Typography>

                    <IconButton className={classes.close} onClick={handleCloseCategoryCreation} size="large">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box my={2}>
                        <Formik
                            initialValues={{
                                name: '',
                                supercategory: null
                            }}
                            validationSchema={Yup.object().shape({
                                name: Yup.string()
                                    .max(255)
                                    .required('Name is required')
                            })}
                            onSubmit={async (values, {setStatus, setSubmitting}) => {
                                try {
                                    const response = await api.post<{
                                        category: Category;
                                    }>(`/datasets/${dataset.id}/categories/`, values);
                                    saveCategories([...categories, response.data.category]);
                                    setOpenCategoryCreation(false);

                                    if (isMountedRef.current) {
                                        setStatus({success: true});
                                        setSubmitting(false);
                                    }
                                } catch (error) {
                                    enqueueSnackbar(error.message || 'Something went wrong', {variant: 'error'});

                                    if (isMountedRef.current) {
                                        setStatus({success: false});
                                        setSubmitting(false);
                                    }
                                }
                            }}
                        >
                            {({errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values}) => (
                                <form noValidate onSubmit={handleSubmit}>
                                    <Grid container spacing={2}>
                                        <Grid item sm={6} xs={12}>
                                            <TextField
                                                error={Boolean(touched.name && errors.name)}
                                                fullWidth
                                                helperText={touched.name && errors.name}
                                                label="Name *"
                                                margin="normal"
                                                name="name"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                onKeyDown={event => event.stopPropagation()}
                                                value={values.name}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item sm={6} xs={12}>
                                            <InputLabel>Supercategory</InputLabel>
                                            <Select
                                                classes={{select: classes.select}}
                                                error={Boolean(touched.supercategory && errors.supercategory)}
                                                fullWidth
                                                label="Supercategory"
                                                name="supercategory"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.supercategory}
                                                displayEmpty
                                            >
                                                <MenuItem value={null}>
                                                    <em>Pick one</em>
                                                </MenuItem>
                                                {SUPERCATEGORIES.map(supercategory => (
                                                    <MenuItem key={supercategory} value={supercategory}>
                                                        <Box mr={1}>{SUPERCATEGORIES_ICONS[supercategory]}</Box>
                                                        {capitalize(supercategory)}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </Grid>
                                    </Grid>

                                    <Box mt={2}>
                                        <Button
                                            color="primary"
                                            disabled={isSubmitting}
                                            fullWidth
                                            size="large"
                                            type="submit"
                                            variant="contained"
                                        >
                                            Create a new category
                                        </Button>
                                    </Box>
                                </form>
                            )}
                        </Formik>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AddCategoryAction;
