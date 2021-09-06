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


    const searchDatasets = useCallback(async (category_names) => {
        if (category_names.length === 0) return;

        await api.post<{ dataset_ids: string[] }>('/search/datasets', {category_names});
    }, []);

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
