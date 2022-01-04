import React, {FC, useCallback, useEffect, useState} from 'react';
import {
    Autocomplete,
    AutocompleteRenderGroupParams,
    Backdrop,
    Box,
    capitalize,
    Chip, FormControl,
    Hidden,
    InputAdornment, InputLabel,
    ListItem,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {Search as SearchIcon} from '@mui/icons-material';
import {Theme} from 'src/theme';
import api from 'src/utils/api';
import {Category} from 'src/types/category';
import useAuth from 'src/hooks/useAuth';
import useDatasets from 'src/hooks/useDatasets';
import {SUPERCATEGORIES_ICONS} from 'src/config';
import onlyUnique from 'src/utils/onlyUnique';

interface FilterProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    autocomplete: {
        width: '100%',
        maxWidth: 1000,
        margin: 'auto',
        '& input': {
            minHeight: 30
        }
    },
    chip: {
        margin: theme.spacing(1)
    },
    group: {
        position: 'sticky',
        top: 0,
        overflow: 'hidden',
        background: theme.palette.background.paper,
        zIndex: 1
    },
    item: {
        '& > li': {
            paddingLeft: `32px !important`
        }
    },
    backdrop: {
        zIndex: 1250,
        background: 'rgba(0, 0, 0, 0.2)'
    },
    icon: {
        color: theme.palette.text.secondary,
        marginTop: 4,
        paddingRight: theme.spacing(1)
    }
}));

const Filter: FC<FilterProps> = ({className, ...rest}) => {
    const classes = useStyles();

    const [open, setOpen] = useState<boolean>(false);

    const {user} = useAuth();
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
                saveDisplayedDatasets(datasets.filter(dataset => dataset.user_id !== user.id));
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
        <>
            <Hidden smDown>
                <Autocomplete
                    open={open}
                    onOpen={() => {
                        setOpen(true);
                    }}
                    onClose={() => {
                        setOpen(false);
                    }}
                    loading={categories.length === 0}
                    className={classes.autocomplete}
                    disableCloseOnSelect
                    options={categories
                        .sort((a, b) => -b.name.localeCompare(a.name))
                        .sort((a, b) => -b.supercategory.localeCompare(a.supercategory))
                        .filter(category => category.labels_count > 0)}
                    groupBy={category => capitalize(category.supercategory)}
                    getOptionLabel={category => `${capitalize(category.name)}`}
                    multiple
                    onChange={(event, newCategories) => setCategoriesSelected(newCategories as Category[])}
                    value={categoriesSelected}
                    renderInput={params => (
                        <TextField
                            {...params}
                            label="Search for categories..."
                            placeholder={
                                categoriesSelected.length === 0
                                    ? `${categories
                                          .map(category => capitalize(category.name))
                                          .slice(0, 3)
                                          .join(', ')}...`
                                    : ''
                            }
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
                    renderGroup={(params: AutocompleteRenderGroupParams) => (
                        <Box key={params.key}>
                            <ListItem className={classes.group} alignItems="center">
                                <Box
                                    className={classes.icon}
                                    children={SUPERCATEGORIES_ICONS[params.group.toLowerCase()]}
                                />

                                <Typography variant="body2" color="textSecondary" fontWeight="bold">
                                    {params.group}
                                </Typography>
                            </ListItem>
                            <Box className={classes.item} {...params} />
                        </Box>
                    )}
                />
            </Hidden>
            <Hidden smUp>
                <FormControl fullWidth>
                    <InputLabel>Search for categories...</InputLabel>

                    <Select
                        open={open}
                        onOpen={() => {
                            setOpen(true);
                        }}
                        onClose={() => {
                            setOpen(false);
                        }}
                        fullWidth
                        label="Search for categories..."
                        multiple
                        value={categoriesSelected.length > 0 ? categoriesSelected.map(el => el.name) : []}
                        startAdornment={
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        }
                        renderValue={selected => (
                            <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                {selected.map(value => (
                                    <Chip key={value} label={capitalize(value)} />
                                ))}
                            </Box>
                        )}
                    >
                        {categories
                            .filter(category => category.labels_count > 0)
                            .map(category => category.supercategory)
                            .filter(onlyUnique)
                            .sort((a, b) => -b.localeCompare(a))
                            .map(supercategory => (
                                <div key={supercategory}>
                                    <ListItem className={classes.group}>
                                        <Box
                                            className={classes.icon}
                                            children={SUPERCATEGORIES_ICONS[supercategory.toLowerCase()]}
                                        />

                                        <Typography variant="body2" color="textSecondary" fontWeight="bold">
                                            {capitalize(supercategory)}
                                        </Typography>
                                    </ListItem>

                                    {categories
                                        .filter(
                                            category =>
                                                category.labels_count > 0 && category.supercategory === supercategory
                                        )
                                        .sort((a, b) => -b.name.localeCompare(a.name))
                                        .map(category => (
                                            <MenuItem
                                                value={category.name}
                                                key={category.name}
                                                onClick={() => {
                                                    categoriesSelected
                                                        .map(category => category.name)
                                                        .includes(category.name)
                                                        ? setCategoriesSelected(
                                                              categoriesSelected.filter(
                                                                  current => current.name !== category.name
                                                              )
                                                          )
                                                        : setCategoriesSelected(categoriesSelected.concat(category));
                                                }}
                                                selected={categoriesSelected
                                                    .map(category => category.name)
                                                    .includes(category.name)}
                                            >
                                                {capitalize(category.name)} ({category.labels_count})
                                            </MenuItem>
                                        ))}
                                </div>
                            ))}
                    </Select>
                </FormControl>
            </Hidden>
            <Backdrop open={open} className={classes.backdrop} />
        </>
    );
};

export default Filter;
