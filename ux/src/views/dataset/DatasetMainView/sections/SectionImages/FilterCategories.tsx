import React, {FC} from 'react';
import {Autocomplete, capitalize, InputAdornment, TextField} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {ImageSearch as SearchIcon} from '@mui/icons-material';
import {Theme} from 'src/theme';
import {Category} from 'src/types/category';
import useDataset from 'src/hooks/useDataset';
import useCategory from 'src/hooks/useCategory';
import useImages from 'src/hooks/useImages';

interface FilterCategoriesProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        maxWidth: 300,
        margin: theme.spacing(0, 2),
        '& input': {
            minHeight: 30
        }
    },
    toggle: {
        whiteSpace: 'nowrap'
    },
    chip: {
        margin: theme.spacing(1)
    }
}));

const FilterCategories: FC<FilterCategoriesProps> = ({className, ...rest}) => {
    const classes = useStyles();

    const {categories} = useDataset();
    const {saveOffset} = useImages();

    const {currentCategory, saveCurrentCategory} = useCategory();

    const categoriesCopy = categories;

    const handleCategoryChange = category => {
        saveCurrentCategory(category as Category);

        saveOffset(0);
    };

    return (
        <Autocomplete
            className={classes.root}
            options={categoriesCopy
                .sort((a, b) => -b.name.localeCompare(a.name))
                .sort(
                    (a, b) => -b.supercategory.localeCompare(a.supercategory)
                )}
            groupBy={category => capitalize(category.supercategory)}
            getOptionLabel={category => capitalize(category.name)}
            onChange={(event, newCategory) => handleCategoryChange(newCategory)}
            value={currentCategory}
            renderInput={params => (
                <TextField
                    {...params}
                    label="Filter by category..."
                    placeholder={`${categories
                        .map(category => capitalize(category.name))
                        .slice(0, 3)
                        .join(', ')}...`}
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <>
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                                {params.InputProps.startAdornment}
                            </>
                        )
                    }}
                />
            )}
        />
    );
};

export default FilterCategories;
