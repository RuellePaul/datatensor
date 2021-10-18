import React, {FC, useState} from 'react';
import clsx from 'clsx';
import {Box, capitalize, Chip, Link, Typography, useTheme} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';
import AddCategoryAction from 'src/components/core/Labelisator/AddCategoryAction';
import {Category} from 'src/types/category';
import useCategory from 'src/hooks/useCategory';
import useDataset from 'src/hooks/useDataset';
import {COLORS} from 'src/utils/colors';
import {MAX_CATEGORIES_DISPLAYED} from 'src/config';

interface CategoriesProps {
    className?: string;
}

interface CategoryProps {
    category: Category;
    index: number;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
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

const DTCategory: FC<CategoryProps> = ({category, index}) => {
    const theme = useTheme();

    const {currentCategory, saveCurrentCategory} = useCategory();

    const isSelected = currentCategory?.name === category.name;

    return (
        <Box mb={1.5} mr={1.5}>
            <Chip
                clickable
                label={
                    <Typography variant="body2">
                        <strong>
                            {capitalize(category.name)} {category.labels_count}
                        </strong>
                    </Typography>
                }
                onClick={() => saveCurrentCategory(isSelected ? null : category)}
                title={`${category.name} | ${category.supercategory}`}
                size="medium"
                style={
                    isSelected
                        ? {
                              color: theme.palette.getContrastText(COLORS[index]),
                              background: COLORS[index],
                              borderColor: COLORS[index]
                          }
                        : {
                              color: COLORS[index],
                              borderColor: COLORS[index]
                          }
                }
                variant="outlined"
            />
        </Box>
    );
};

const DTCategories: FC<CategoriesProps> = ({className}) => {
    const classes = useStyles();

    const {categories} = useDataset();

    const [expand, setExpand] = useState<boolean>(false);

    return (
        <div className={clsx(classes.root, className, 'scroll')}>
            {expand ? (
                <>
                    {categories.map(category => (
                        <DTCategory category={category} key={category.id} index={categories.indexOf(category)} />
                    ))}

                    <AddCategoryAction />
                </>
            ) : (
                <>
                    {categories
                        .sort((a, b) => (a.labels_count > b.labels_count ? -1 : 1))
                        .slice(0, MAX_CATEGORIES_DISPLAYED)
                        .map(category => (
                            <DTCategory category={category} key={category.id} index={categories.indexOf(category)} />
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
    );
};

export default DTCategories;
