import React, {FC, useState} from 'react';
import {
    Autocomplete,
    AutocompleteRenderGroupParams,
    Backdrop,
    Box,
    capitalize,
    CircularProgress,
    InputAdornment,
    ListItem,
    TextField,
    Typography
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {ImageSearch as SearchIcon} from '@mui/icons-material';
import {Theme} from 'src/theme';
import {Category} from 'src/types/category';
import useDataset from 'src/hooks/useDataset';
import useCategory from 'src/hooks/useCategory';
import useImages from 'src/hooks/useImages';
import {SUPERCATEGORIES_ICONS} from '../../../../../config';

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
    },
    group: {
        position: 'sticky',
        top: 0,
        overflow: 'hidden',
        background: theme.palette.background.paper
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

const FilterCategories: FC<FilterCategoriesProps> = ({className, ...rest}) => {
    const classes = useStyles();

    const [open, setOpen] = useState<boolean>(false);

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
                open={open}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                loading={categories.length === 0}
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

            <Backdrop open={open} className={classes.backdrop} />
        </div>
    );
};

export default FilterCategories;
