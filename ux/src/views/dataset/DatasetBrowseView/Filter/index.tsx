import React, {FC, useCallback, useEffect, useState} from 'react';
import {Autocomplete, capitalize, InputAdornment, TextField} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {Search as SearchIcon} from '@mui/icons-material';
import {Theme} from 'src/theme';
import api from 'src/utils/api';
import {Category} from 'src/types/category';
import useDatasets from 'src/hooks/useDatasets';

interface FilterProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        maxWidth: 1000,
        margin: 'auto',
        '& input': {
            minHeight: 30
        }
    },
    chip: {
        margin: theme.spacing(1)
    }
}));

const Filter: FC<FilterProps> = ({className, ...rest}) => {
    const classes = useStyles();

    const {datasets, saveDisplayedDatasets} = useDatasets();

    const [categories, setCategories] = useState<Category[]>([]);
    const fetchCategories = useCallback(async () => {
        try {
            const response = await api.get<{categories: Category[]}>(`/search/categories`);
            setCategories(response.data.categories);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const [categoriesSelected, setCategoriesSelected] = useState<Category[]>([]);

    const searchDatasets = useCallback(
        async category_names => {
            if (category_names.length === 0) {
                saveDisplayedDatasets(datasets);
                return;
            }

            const response = await api.post<{dataset_ids: string[]}>('/search/datasets', {category_names});
            saveDisplayedDatasets(datasets.filter(dataset => response.data.dataset_ids.includes(dataset.id)));
        }, // eslint-disable-next-line
        [datasets]
    );

    useEffect(() => {
        searchDatasets(categoriesSelected.map(category => category.name));
    }, [searchDatasets, categoriesSelected]);

    return (
        <Autocomplete
            className={classes.root}
            options={categories
                .sort((a, b) => -b.name.localeCompare(a.name))
                .sort((a, b) => -b.supercategory.localeCompare(a.supercategory))}
            groupBy={category => capitalize(category.supercategory)}
            getOptionLabel={category => capitalize(category.name)}
            multiple
            onChange={(event, newCategories) => setCategoriesSelected(newCategories as Category[])}
            value={categoriesSelected}
            renderInput={params => (
                <TextField
                    {...params}
                    label="Search for categories..."
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

export default Filter;
