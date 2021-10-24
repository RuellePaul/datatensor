import React, {FC, useState} from 'react';
import {useSnackbar} from 'notistack';
import clsx from 'clsx';
import {Box, capitalize, Chip, Link, Typography, useTheme} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import api from 'src/utils/api';
import {Theme} from 'src/theme';
import {Category} from 'src/types/category';
import AddCategoryAction from 'src/components/core/Labelisator/AddCategoryAction';
import useDataset from 'src/hooks/useDataset';
import useImage from 'src/hooks/useImage';
import useCategory from 'src/hooks/useCategory';
import {currentCategoryCount} from 'src/utils/labeling';
import {MAX_CATEGORIES_DISPLAYED} from 'src/config';
import {COLORS} from 'src/utils/colors';

interface CategoriesProps {
    className?: string;
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
        marginLeft: theme.spacing(1)
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
            saveLabels(labels => labels.filter(label => label.category_id !== category_id));

            if (currentCategory && currentCategory.id === category_id) saveCurrentCategory(null);
        } catch (error) {
            enqueueSnackbar(error.message || 'Something went wrong', {
                variant: 'error'
            });
        }
    };

    const count = labels ? currentCategoryCount(labels, category) : 0;

    return (
        <Chip
            clickable
            label={
                <Typography variant="body2">
                    {count > 0 ? (
                        <>
                            <Typography
                                component="span"
                                style={{
                                    fontWeight: count > 0 ? 'bold' : 'initial'
                                }}
                            >
                                {capitalize(category.name)}{' '}
                            </Typography>
                            ({count})
                        </>
                    ) : (
                        capitalize(category.name)
                    )}
                </Typography>
            }
            onClick={() => saveCurrentCategory(category)}
            style={
                isSelected
                    ? {
                          color: theme.palette.getContrastText(COLORS[index]),
                          background: COLORS[index]
                      }
                    : {color: COLORS[index]}
            }
            title={`${category.name} | ${category.supercategory}`}
            size={count > 0 ? 'medium' : 'small'}
            variant="outlined"
            onDelete={() => handleDeleteCategory(category.id)}
        />
    );
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
                <Typography variant="overline" color="textPrimary">
                    On this image
                </Typography>
                <div className={classes.wrapper}>
                    {labeledCategories
                        .sort((a, b) => -b.name.localeCompare(a.name))
                        .map(category => (
                            <Box mr={1} mb={1} key={category.id}>
                                <DTCategory category={category} index={categories.indexOf(category)} />
                            </Box>
                        ))}

                    {children}
                </div>
            </Box>

            <Typography variant="overline" color="textPrimary">
                Other categories
            </Typography>

            <div className={classes.wrapper}>
                {expand ? (
                    unlabeledCategories
                        .sort((a, b) => -b.name.localeCompare(a.name))
                        .map(category => (
                            <Box mr={1} mb={1} key={category.id}>
                                <DTCategory category={category} index={categories.indexOf(category)} />
                            </Box>
                        ))
                ) : (
                    <>
                        {unlabeledCategories
                            .sort((a, b) => -b.name.localeCompare(a.name))
                            .slice(0, MAX_CATEGORIES_DISPLAYED)
                            .map(category => (
                                <Box mr={1} mb={1} key={category.id}>
                                    <DTCategory category={category} index={categories.indexOf(category)} />
                                </Box>
                            ))}
                        {unlabeledCategories.length > MAX_CATEGORIES_DISPLAYED && (
                            <Link
                                className={classes.link}
                                onClick={() => {
                                    setExpand(true);
                                }}
                            >
                                and {unlabeledCategories.length - MAX_CATEGORIES_DISPLAYED} more...
                            </Link>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

const DTCategories: FC<CategoriesProps> = ({className}) => {
    const classes = useStyles();

    const {categories} = useDataset();

    return (
        <div className={clsx(classes.root, className)}>
            <Chips categories={categories}>
                <AddCategoryAction />
            </Chips>
        </div>
    );
};

export default DTCategories;
