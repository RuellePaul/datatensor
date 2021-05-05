import React, {FC, useState} from 'react';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import {
    Box,
    Button,
    capitalize,
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
import {Category} from 'src/types/category';
import useDataset from 'src/hooks/useDataset';
import useImages from 'src/hooks/useImages';

interface CategorysProps {

}

const useStyles = makeStyles((theme: Theme) => ({
    categories: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    chip: {},
    close: {
        position: 'absolute',
        right: theme.spacing(2),
        top: theme.spacing(2),
        color: theme.palette.grey[500]
    }
}));

const DTCategorys: FC<CategorysProps> = () => {

    const classes = useStyles();

    const {dataset, saveDataset} = useDataset();
    const {images} = useImages();

    const isMountedRef = useIsMountedRef();

    const [openCategoryCreation, setOpenCategoryCreation] = useState(false);

    const computeLabel = (category: Category) => {
        return `${capitalize(category.name)} | ${images.map(image => image.labels.filter(label => label.category_id === category.id).length || 0).reduce((acc, val) => acc + val, 0)}`
    };

    const handleCloseCategoryCreation = () => {
        setOpenCategoryCreation(false);
    };

    const handleDeleteCategory = (category: Category) => {
        // TODO
        console.log(category)
    };

    return (
        <>
            <Grid container spacing={2}>
                <Grid item sm={9} xs={12}>
                    <div className={classes.categories}>
                        {dataset.categories.map(category => (
                            <Box
                                m={0.5}
                                key={category.name}
                            >
                                <Chip
                                    className={classes.chip}
                                    clickable
                                    label={computeLabel(category)}
                                    onDelete={() => handleDeleteCategory(category)}
                                />
                            </Box>
                        ))}
                    </div>
                </Grid>
                <Divider flexItem/>
                <Grid item sm={3} xs={12}>
                    <Button
                        color="primary"
                        onClick={() => setOpenCategoryCreation(true)}
                        size="small"
                        variant="contained"
                    >
                        New category
                    </Button>
                </Grid>
            </Grid>

            <Dialog
                fullWidth
                maxWidth='sm'
                open={openCategoryCreation}
                onClose={handleCloseCategoryCreation}
            >
                <DialogTitle
                    className='flex'
                    disableTypography
                >
                    <Typography variant='h4'>
                        Create category
                    </Typography>

                    <IconButton
                        className={classes.close}
                        onClick={handleCloseCategoryCreation}
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
                                    const response = await api.post<Category>(`/v1/categories/`, {dataset_id: dataset.id, ...values});
                                    saveDataset({...dataset, categories: [...dataset.categories, response.data]});

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
                                        label="Category name"
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
    )
};

export default DTCategorys;