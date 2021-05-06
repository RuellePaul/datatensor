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
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
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
import useCategory from 'src/hooks/useCategory';
import {COLORS} from 'src/utils/colors';
import {SUPERCATEGORIES} from 'src/constants';
import {useSnackbar} from 'notistack';

interface CategoriesProps {

}

const useStyles = makeStyles((theme: Theme) => ({
    categories: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    chip: {},
    close: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    }
}));

const DTCategories: FC<CategoriesProps> = () => {

    const classes = useStyles();
    const isMountedRef = useIsMountedRef();

    const {enqueueSnackbar} = useSnackbar();

    const {dataset, saveDataset} = useDataset();
    const {images} = useImages();

    const {category, saveCategory} = useCategory();

    const [openCategoryCreation, setOpenCategoryCreation] = useState(false);

    const computeLabel = (category: Category) => {
        return (
            <Typography variant='body2'>
                <Typography component='span' style={{fontWeight: 'bold'}}>
                    {capitalize(category.name)}
                    {' '}
                </Typography>
                ({images.map(image => image.labels.filter(label => label.category_name === category.name).length || 0).reduce((acc, val) => acc + val, 0)})
            </Typography>
        )

    };

    const handleCloseCategoryCreation = () => {
        setOpenCategoryCreation(false);
    };

    return (
        <>
            <Grid container spacing={2}>
                <Grid item sm={9} xs={12}>
                    <div className={classes.categories}>
                        {dataset.categories.map((currentCategory, index) => (
                            <Box
                                m={0.5}
                                key={currentCategory.name}
                            >
                                <Chip
                                    className={classes.chip}
                                    clickable
                                    label={computeLabel(currentCategory)}
                                    onClick={() => saveCategory(currentCategory)}
                                    style={{color: COLORS[index]}}
                                    variant={category?.name === currentCategory.name ? 'outlined' : 'default'}
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
                        Add a new category
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
                                name: '',
                                supercategory: null
                            }}
                            validationSchema={Yup.object().shape({
                                name: Yup.string().max(255).required('Name is required'),
                                supercategory: Yup.string().max(255)
                            })}
                            onSubmit={async (values, {
                                setStatus,
                                setSubmitting
                            }) => {
                                try {
                                    const response = await api.post<Category>(`/v1/categories/`, {dataset_id: dataset.id, ...values});
                                    saveDataset({...dataset, categories: [...dataset.categories, response.data]});
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
                                    <Grid container spacing={2}>
                                        <Grid item sm={6} xs={12}>
                                            <TextField
                                                autoFocus
                                                error={Boolean(touched.name && errors.name)}
                                                fullWidth
                                                helperText={touched.name && errors.name}
                                                label="Name *"
                                                margin="normal"
                                                name="name"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.name}
                                                variant="outlined"
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item sm={6} xs={12}>
                                            <InputLabel>Supercategory</InputLabel>
                                            <Select
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
                                                    <MenuItem
                                                        key={supercategory}
                                                        value={supercategory}
                                                    >
                                                        {capitalize(supercategory)}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </Grid>
                                    </Grid>

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

export default DTCategories;