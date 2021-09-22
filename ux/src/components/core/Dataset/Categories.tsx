import React, {FC} from 'react';
import clsx from 'clsx';
import {Box, capitalize, Chip, makeStyles, Typography} from '@material-ui/core';
import {Theme} from 'src/theme';
import {Category} from 'src/types/category';
import useDataset from 'src/hooks/useDataset';
import {COLORS} from 'src/utils/colors';

interface CategoriesProps {
    className?: string
}

interface CategoryProps {
    category: Category;
    index: number;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap'
    }
}));

const DTCategory: FC<CategoryProps> = ({category, index}) => {

    return (
        <Chip
            clickable
            label={(
                <Typography variant='body2'>
                    <strong>
                        {capitalize(category.name)} {(category.labels_count)}
                    </strong>
                </Typography>
            )}
            onClick={() => {
            }}
            style={{color: COLORS[index]}}
            title={`${category.name} | ${category.supercategory}`}
            size='medium'
            variant='outlined'
        />
    )
};

const DTCategories: FC<CategoriesProps> = ({className}) => {

    const classes = useStyles();

    const {categories} = useDataset();

    return (
        <div className={clsx(classes.root, className, 'scroll')}>
            {
                categories
                    .sort((a, b) => a.labels_count > b.labels_count ? -1 : 1)
                    .map(category => (
                        <Box
                            m={0.5}
                            key={category.id}
                        >
                            <DTCategory
                                category={category}
                                index={categories.indexOf(category)}
                            />
                        </Box>
                    ))
            }
        </div>
    )
};

export default DTCategories;