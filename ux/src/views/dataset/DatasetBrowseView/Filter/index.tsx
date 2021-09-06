import React, {FC, useCallback, useEffect, useState} from 'react';
import clsx from 'clsx';
import {
    Box,
    capitalize,
    Card,
    Checkbox,
    FormControlLabel,
    InputAdornment,
    makeStyles,
    TextField
} from '@material-ui/core';
import {Autocomplete} from '@material-ui/lab';
import SearchIcon from '@material-ui/icons/Search';
import {Theme} from 'src/theme';
import api from 'src/utils/api';
import {Category} from 'src/types/category';
import useDatasets from '../../../../hooks/useDatasets';

interface FilterProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    searchInput: {
        width: '100%',
        marginRight: theme.spacing(3),
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

const Filter: FC<FilterProps> = ({className, ...rest}) => {

    const classes = useStyles();

    const {datasets, saveDisplayedDatasets} = useDatasets();

    const [categories, setCategories] = useState<Category[]>([]);
    const fetchCategories = useCallback(async () => {
        try {
            const response = await api.get<{ categories: Category[] }>(`/search/categories`);
            setCategories(response.data.categories);
        } catch (err) {
            console.error(err);
        }

    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);


    const [categoriesSelected, setCategoriesSelected] = useState<Category[]>([]);

    const searchDatasets = useCallback(async (category_names) => {
        if (category_names.length === 0) {
            saveDisplayedDatasets(datasets);
            return;
        }

        const response = await api.post<{ dataset_ids: string[] }>('/search/datasets', {category_names});
        saveDisplayedDatasets(datasets.filter(dataset => response.data.dataset_ids.includes(dataset.id)))
    }, [datasets]);

    useEffect(() => {
        searchDatasets(categoriesSelected.map(category => category.name));
    }, [searchDatasets, categoriesSelected])

    return (
        <Card
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Box
                p={2}
                display="flex"
                alignItems="center"
            >
                <Autocomplete
                    className={classes.searchInput}
                    options={categories
                        .sort((a, b) => -b.name.localeCompare(a.name))
                        .sort((a, b) => -b.supercategory.localeCompare(a.supercategory))
                    }
                    groupBy={(category) => capitalize(category.supercategory)}
                    getOptionLabel={(category) => capitalize(category.name)}
                    multiple
                    onChange={(event, newCategories) => setCategoriesSelected(newCategories as Category[])}
                    value={categoriesSelected}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label='Search for categories...'
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
                <Box flexGrow={1}/>
                <FormControlLabel
                    className={classes.toggle}
                    control={(
                        <Checkbox defaultChecked/>
                    )}
                    label="Show public datasets"
                />
            </Box>
        </Card>
    );
};

export default Filter;
