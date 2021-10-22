import React, {FC} from 'react';
import {Autocomplete, capitalize, CircularProgress, InputAdornment, TextField, Typography} from '@mui/material';
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
        maxWidth: 320,
        [theme.breakpoints.down('sm')]: {
            maxWidth: 'initial'
        }
    },
    autocomplete: {
        '& input': {
            minHeight: 30
        }
    },
    toggle: {
        whiteSpace: 'nowrap'
    },
    chip: {
        margin: theme.spacing(1)
    },
    loader: {
        marginTop: theme.spacing(1),
        width: '16px !important',
        height: '16px !important'
    }
}));

const FilterCategories: FC<FilterCategoriesProps> = ({className, ...rest}) => {
    const classes = useStyles();

    const {categories} = useDataset();
    const {saveOffset} = useImages();

    const {currentCategory, saveCurrentCategory} = useCategory();
    const {images, totalImagesCount} = useImages();

    const categoriesCopy = categories;

    const handleCategoryChange = category => {
        saveCurrentCategory(category as Category);

        saveOffset(0);
    };

    return (
        <div className={classes.root}>
            <Autocomplete
                className={classes.autocomplete}
                options={categoriesCopy
                    .sort((a, b) => -b.name.localeCompare(a.name))
                    .sort((a, b) => -b.supercategory.localeCompare(a.supercategory))}
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
                            .slice(0, 2)
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
                        size="small"
                    />
                )}
            />

            {currentCategory !== null && totalImagesCount > 0 && (
                <Typography variant="caption" color="textPrimary">
                    {totalImagesCount} image{totalImagesCount > 1 ? 's' : ''} found
                </Typography>
            )}

            {currentCategory !== null && totalImagesCount === 0 && (
                <Typography variant="caption" color="textPrimary">
                    No images found
                </Typography>
            )}

            {currentCategory !== null && images?.length === 0 && (
                <CircularProgress className={classes.loader} color="primary" disableShrink />
            )}
        </div>
    );
};

export default FilterCategories;
