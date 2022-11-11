import React, {cloneElement, FC, useMemo, useState} from 'react';
import clsx from 'clsx';
import {Box, ButtonBase, capitalize, Chip, Link, Typography, useTheme} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {Theme} from 'src/theme';
import {Category} from 'src/types/category';
import AddCategoryAction from 'src/components/core/Labelisator/AddCategoryAction';
import useDataset from 'src/hooks/useDataset';
import useImage from 'src/hooks/useImage';
import useCategory from 'src/hooks/useCategory';
import {currentCategoryCount} from 'src/utils/labeling';
import {MAX_CATEGORIES_DISPLAYED, SUPERCATEGORIES_ICONS} from 'src/config';
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
    button: {
        borderRadius: 16
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

    const classes = useStyles();
    const theme = useTheme();

    const {saveCurrentCategory} = useCategory();
    const {labels} = useImage();

    const count = labels ? currentCategoryCount(labels, category) : 0;

    return (
        <ButtonBase
            className={classes.button}
            onClick={() => saveCurrentCategory(category)}
        >
            <Chip
                clickable
                icon={
                    cloneElement(
                        SUPERCATEGORIES_ICONS[category.supercategory],
                        {style: {color: theme.palette.getContrastText(COLORS[index])}}
                    )
                }
                label={
                    <Typography variant="body2">
                        <strong>
                            {capitalize(category.name)}
                            {count > 0 ? (category.labels_count && ` • ${count}`) : ''}
                        </strong>
                    </Typography>
                }
                style={{
                    color: theme.palette.getContrastText(COLORS[index]),
                    background: COLORS[index]
                }}
                title={`${capitalize(category.name)} | ${capitalize(category.supercategory)}`}
                size={count > 0 ? 'medium' : 'small'}
            />
        </ButtonBase>
    );
};

const Chips: FC<ChipsProps> = ({categories, children}) => {
    const classes = useStyles();
    const {labels} = useImage();

    const [expand, setExpand] = useState<boolean>(false);

    const labeledCategories = useMemo(
        () => (labels ? categories.filter(category => currentCategoryCount(labels, category) > 0) : []),
        [categories, labels]
    );

    const unlabeledCategories = useMemo(
        () => (labels ? categories.filter(category => currentCategoryCount(labels, category) === 0) : categories),
        [categories, labels]
    );

    return (
        <div className={clsx(classes.root, 'scroll')}>
            <Box mb={2}>
                <Typography variant="overline" color="textPrimary">
                    On this image
                </Typography>
                <div className={classes.wrapper}>
                    {labeledCategories.map(category => (
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
                    unlabeledCategories.map(category => (
                        <Box mr={1} mb={1} key={category.id}>
                            <DTCategory category={category} index={categories.indexOf(category)} />
                        </Box>
                    ))
                ) : (
                    <>
                        {unlabeledCategories.slice(0, MAX_CATEGORIES_DISPLAYED).map(category => (
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
