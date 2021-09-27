import React, {FC, useState} from 'react';
import {useSnackbar} from 'notistack';
import clsx from 'clsx';

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
    Link,
    makeStyles,
    MenuItem,
    Select,
    TextField,
    Typography,
    useTheme
} from '@material-ui/core';
import {Add as AddIcon, Close as CloseIcon} from '@material-ui/icons';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import api from 'src/utils/api';
import {Theme} from 'src/theme';
import {Category} from 'src/types/category';
import useDataset from 'src/hooks/useDataset';
import useImage from 'src/hooks/useImage';
import useCategory from 'src/hooks/useCategory';
import {currentCategoryCount} from 'src/utils/labeling';
import {MAX_CATEGORIES_DISPLAYED, SUPERCATEGORIES} from 'src/config';
import {COLORS} from 'src/utils/colors';

interface CategoriesProps {
    className?: string
}

interface CategoryProps {
    category: Category;
    index: number;
}

interface ChipsProps {
    categories: Category[];
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%'
    },
    wrapper: {
        marginTop: theme.spacing(1),
        display: 'flex',
        flexWrap: 'wrap'
    },
    link: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: theme.spacing(1),
        cursor: 'pointer'
    },
    close: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    }
}));

const DTCategory: FC<CategoryProps> = ({category, index}) => {

    const theme = useTheme();
    const {enqueueSnackbar} = useSnackbar();

    const {dataset, saveCategories} = useDataset();
    const {currentCategory, saveCurrentCategory} = useCategory();
    const {labels, saveLabels} = useImage();

    const isSelected = currentCategory?.name === category.name;

    const handleDeleteCategory = async (category_id: string) => {
        try {
            await api.delete(`/datasets/${dataset.id}/categories/${category_id}`);

            saveCategories(categories => categories.filter(category => category.id !== category_id));
            saveLabels(labels => labels.filter(label => label.category_id !== category_id))

            if (currentCategory && currentCategory.id === category_id)
                saveCurrentCategory(null);
        } catch (error) {
            enqueueSnackbar(error.message || 'Something went wrong', {variant: 'error'});
        }
    };

    const count = labels ? currentCategoryCount(labels, category) : 0;

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
            style={isSelected
                ? {color: theme.palette.getContrastText(COLORS[index]), background: COLORS[index]}
                : {color: COLORS[index]}
            }
            title={`${category.name} | ${category.supercategory}`}
            size={count > 0 ? 'medium' : 'small'}
            variant='outlined'
            onDelete={() => handleDeleteCategory(category.id)}
        />
    )
};

const Chips: FC<ChipsProps> = ({categories, children}) => {

    const classes = useStyles();
    const {labels} = useImage();

    const [expand, setExpand] = useState<boolean>(false);

    let labeledCategories, unlabeledCategories;

    if (labels) {
        labeledCategories = categories.filter(category => currentCategoryCount(labels, category) > 0);
        unlabeledCategories = categories.filter(category => currentCategoryCount(labels, category) === 0);
    } else {
        labeledCategories = [];
        unlabeledCategories = categories;
    }

    return (
        <div className={clsx(classes.root, 'scroll')}>
            <Box mb={2}>
                <Typography
                    variant='overline'
                    color='textPrimary'
                >
                    On this image
                </Typography>
                <div className={classes.wrapper}>
                    {
                        labeledCategories.map(category => (
                            <Box
                                mr={1}
                                mb={1}
                                key={category.id}
                            >
                                <DTCategory
                                    category={category}
                                    index={categories.indexOf(category)}
                                />
                            </Box>
                        ))
                    }
                    <Box
                        mr={1}
                        mb={1}
                    >
                        {children}
                    </Box>
                </div>
            </Box>

            <Typography
                variant='overline'
                color='textPrimary'
            >
                Other categories
            </Typography>

            <div className={classes.wrapper}>
                {expand ? (
                    unlabeledCategories.map(category => (
                        <Box
                            mr={1}
                            mb={1}
                            key={category.id}
                        >
                            <DTCategory
                                category={category}
                                index={categories.indexOf(category)}
                            />
                        </Box>))
                ) : (
                    <>
                        {unlabeledCategories.slice(0, MAX_CATEGORIES_DISPLAYED).map(category => (
                            <Box
                                mr={1}
                                mb={1}
                                key={category.id}
                            >
                                <DTCategory
                                    category={category}
                                    index={categories.indexOf(category)}
                                />
                            </Box>
                        ))}
                        {unlabeledCategories.length > MAX_CATEGORIES_DISPLAYED && (
                            <Link
                                className={classes.link}
                                onClick={() => {
                                    setExpand(true)
                                }}
                            >
                                and {unlabeledCategories.length - MAX_CATEGORIES_DISPLAYED} more...
                            </Link>
                        )}
                    </>
                )}
            </div>
        </div>
    )
};

const DTCategories: FC<CategoriesProps> = ({className}) => {

    const classes = useStyles();
    const isMountedRef = useIsMountedRef();

    const {enqueueSnackbar} = useSnackbar();

    const {dataset, categories, saveCategories} = useDataset();

    const [openCategoryCreation, setOpenCategoryCreation] = useState(false);

    const handleCloseCategoryCreation = () => {
        setOpenCategoryCreation(false);
    };

    return (
        <div className={clsx(classes.root, className)}>
            <Chips
                categories={categories}
            >
                <Chip
                    label='New category'
                    icon={<AddIcon/>}
                    onClick={() => setOpenCategoryCreation(true)}
                    variant='outlined'
                />
            </Chips>

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
                                name: Yup.string().max(255).required('Name is required')
                            })}
                            onSubmit={async (values, {
                                setStatus,
                                setSubmitting
                            }) => {
                                try {
                                    const response = await api.post<{ category: Category }>(`/datasets/${dataset.id}/categories/`, values);
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
        </div>
    )
};

export default DTCategories;