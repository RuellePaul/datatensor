import React, {FC, useCallback, useEffect, useState} from 'react';
import {capitalize, InputAdornment, makeStyles, TextField} from '@material-ui/core';
import {Autocomplete} from '@material-ui/lab';
import SearchIcon from '@material-ui/icons/Search';
import {Theme} from 'src/theme';
import {Category} from 'src/types/category';
import useDataset from 'src/hooks/useDataset';
import api from 'src/utils/api';
import {Image} from 'src/types/image';

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

    const {dataset, categories} = useDataset();

    const [category, setCategory] = useState<Category>(null);

    const fetchImagesCategory = useCallback(async () => {
        if (!category)
            return;

        try {
            const response = await api.get<{ images: Image[] }>(`/datasets/${dataset.id}/categories/${category.id}/images`);
            console.log(response.data.images);
        } catch (err) {
            console.error(err);
        }

    }, [dataset.id, category]);

    useEffect(() => {
        fetchImagesCategory()
    }, [fetchImagesCategory])

    return (
        <Autocomplete
            className={classes.root}
            options={categories
                .sort((a, b) => -b.name.localeCompare(a.name))
                .sort((a, b) => -b.supercategory.localeCompare(a.supercategory))
            }
            groupBy={(category) => capitalize(category.supercategory)}
            getOptionLabel={(category) => capitalize(category.name)}
            onChange={(event, newCategory) => setCategory(newCategory as Category)}
            value={category}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label='Search for categories...'
                    placeholder={category && `${categories.map(category => capitalize(category.name)).slice(0, 3).join(', ')}...`}
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <>
                                <InputAdornment position='start'>
                                    <SearchIcon/>
                                </InputAdornment>
                                {params.InputProps.startAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
};

export default FilterCategories;
