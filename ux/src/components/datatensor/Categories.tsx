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
import useImage from 'src/hooks/useImage';
import useCategory from 'src/hooks/useCategory';
import {COLORS} from 'src/utils/colors';
import {currentCategoryCount} from 'src/utils/labeling';
import {SUPERCATEGORIES} from 'src/constants';
import {useSnackbar} from 'notistack';

interface CategoriesProps {

}

interface CategoryProps {
    category: Category;
    index: number;
}

interface ChipsProps {
    categories: Category[];
}

const useStyles = makeStyles((theme: Theme) => ({
    categories: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    close: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    }
}));

const DTCategory: FC<CategoryProps> = ({category, index}) => {

    const {currentCategory, saveCurrentCategory} = useCategory();
    const {labels} = useImage();

    const count = currentCategoryCount(labels, category);

    return (
        <Chip
            clickable
            label={(
                <Typography variant='body2'>
                    {count > 0
                        ? <>
                            <Typography
                                component='span'
                                style={{fontWeight: count > 0 ? 'bold' : 'initial'}}
                            >
                                {capitalize(category.name)}
                                {' '}
                            </Typography>
                            ({count})
                        </>
                        : capitalize(category.name)
                    }
                </Typography>
            )}
            onClick={() => saveCurrentCategory(category)}
            style={{color: COLORS[index]}}
            variant={currentCategory?.name === category.name ? 'outlined' : 'default'}
            title={`${category.name} | ${category.supercategory}`}
        />
    )
};

const Chips: FC<ChipsProps> = ({categories}) => {

    const classes = useStyles();
    const {labels} = useImage();

    const labeledCategories = categories.filter(category => currentCategoryCount(labels, category) > 0);
    const unlabeledCategories = categories.filter(category => currentCategoryCount(labels, category) === 0);

    return (
        <>
            <div className={classes.categories}>
                {
                    labeledCategories.map((category, index) => (
                        <Box
                            m={0.5}
                            key={category._id}
                        >
                            <DTCategory
                                category={category}
                                index={categories.indexOf(category)}
                            />
                        </Box>
                    ))
                }
            </div>
            <Box
                my={1}
            >
                <Divider/>
            </Box>
            <div className={classes.categories}>
                {
                    unlabeledCategories.map((category, index) => (
                        <Box
                            m={0.5}
                            key={category._id}
                        >
                            <DTCategory
                                category={category}
                                index={categories.indexOf(category)}
                            />
                        </Box>
                    ))
                }
            </div>
        </>
    )
};

const DTCategories: FC<CategoriesProps> = () => {

    const classes = useStyles();
    const isMountedRef = useIsMountedRef();

    const {enqueueSnackbar} = useSnackbar();

    const {dataset, categories, saveCategories} = useDataset();
    const {labels} = useImage();

    const [openCategoryCreation, setOpenCategoryCreation] = useState(false);

    const handleCloseCategoryCreation = () => {
        setOpenCategoryCreation(false);
    };

    if (!labels)
        return null;

    return (
        <>
            <Chips
                categories={categories}
            />
            <Button
                color="primary"
                onClick={() => setOpenCategoryCreation(true)}
                size="small"
                variant="contained"
            >
                New category
            </Button>

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
                                    const response = await api.post<{ category: Category }>(`/datasets/${dataset._id}/categories/`, values);
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