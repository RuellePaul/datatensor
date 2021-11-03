import React, {FC, useState} from 'react';
import clsx from 'clsx';
import {useSnackbar} from 'notistack';

import {Box, Button, capitalize, Chip, IconButton, Link, Tooltip, Typography, useTheme} from '@mui/material';
import {CreateOutlined as EditIcon, Delete as DeleteIcon} from '@mui/icons-material';
import makeStyles from '@mui/styles/makeStyles';

import {Theme} from 'src/theme';
import AddCategoryAction from 'src/components/core/Labelisator/AddCategoryAction';
import {Category} from 'src/types/category';
import useDataset from 'src/hooks/useDataset';
import useImage from 'src/hooks/useImage';
import useCategory from 'src/hooks/useCategory';
import api from 'src/utils/api';
import {COLORS} from 'src/utils/colors';
import {MAX_CATEGORIES_DISPLAYED} from 'src/config';

interface CategoriesProps {
    className?: string;
}

interface CategoryProps {
    category: Category;
    index: number;
    edit: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    categories: {
        display: 'flex',
        flexWrap: 'wrap',
        alignContent: 'flex-start'
    },
    link: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: theme.spacing(1)
    }
}));

const DTCategory: FC<CategoryProps> = ({category, index, edit}) => {
    const theme = useTheme();

    const {enqueueSnackbar} = useSnackbar();

    const {dataset, saveCategories} = useDataset();
    const {currentCategory, saveCurrentCategory} = useCategory();
    const {saveLabels} = useImage();

    const handleDeleteCategory = async (category_id: string) => {
        try {
            await api.delete(`/datasets/${dataset.id}/categories/${category_id}`);

            saveCategories(categories => categories.filter(category => category.id !== category_id));
            saveLabels(labels => labels.filter(label => label.category_id !== category_id));

            if (currentCategory && currentCategory.id === category_id) saveCurrentCategory(null);
        } catch (error) {
            enqueueSnackbar(error.message || 'Something went wrong', {
                variant: 'error'
            });
        }
    };

    return (
        <Box mb={1.5} mr={1.5}>
            <Chip
                label={
                    <Typography variant="body2">
                        <strong>
                            {capitalize(category.name)}
                            {category.labels_count && ` • ${category.labels_count}`}
                        </strong>
                    </Typography>
                }
                title={`${capitalize(category.name)} | ${capitalize(category.supercategory)}`}
                size="medium"
                style={{
                    color: theme.palette.getContrastText(COLORS[index]),
                    background: COLORS[index],
                    borderColor: COLORS[index],
                    boxShadow: theme.shadows[1]
                }}
                variant="outlined"
                onDelete={edit ? () => handleDeleteCategory(category.id) : null}
                deleteIcon={
                    edit && (
                        <Tooltip title={`Delete "${capitalize(category.name)}" category`}>
                            <IconButton size="small">
                                <DeleteIcon style={{color: theme.palette.getContrastText(COLORS[index])}} />
                            </IconButton>
                        </Tooltip>
                    )
                }
            />
        </Box>
    );
};

const DTCategories: FC<CategoriesProps> = ({className}) => {
    const classes = useStyles();

    const {categories} = useDataset();

    const [expand, setExpand] = useState<boolean>(false);
    const [edit, setEdit] = useState<boolean>(false);

    const toggleEdit = () => {
        setEdit(true);
    };

    return (
        <div className={clsx(classes.root, className)}>
            <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="overline" color="textPrimary">
                    Labels per category
                </Typography>

                <Button onClick={toggleEdit} endIcon={<EditIcon />} size="small" disabled={edit}>
                    Edit
                </Button>
            </Box>

            <div className={classes.categories}>
                {expand ? (
                    <>
                        {categories.map(category => (
                            <DTCategory
                                category={category}
                                key={category.id}
                                index={categories.indexOf(category)}
                                edit={edit}
                            />
                        ))}

                        <AddCategoryAction />
                    </>
                ) : (
                    <>
                        {categories
                            .sort((a, b) => (a.labels_count > b.labels_count ? -1 : 1))
                            .slice(0, MAX_CATEGORIES_DISPLAYED)
                            .map(category => (
                                <DTCategory
                                    category={category}
                                    key={category.id}
                                    index={categories.indexOf(category)}
                                    edit={edit}
                                />
                            ))}
                        {categories.length > MAX_CATEGORIES_DISPLAYED ? (
                            <Link className={classes.link} onClick={() => setExpand(true)}>
                                and {categories.length - MAX_CATEGORIES_DISPLAYED} more...
                            </Link>
                        ) : (
                            <AddCategoryAction />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default DTCategories;
