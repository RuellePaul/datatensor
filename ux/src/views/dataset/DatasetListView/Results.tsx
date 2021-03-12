import React, {ChangeEvent, FC, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
    Box,
    Button,
    Card,
    Checkbox,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Link,
    makeStyles,
    SvgIcon,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TextField
} from '@material-ui/core';
import {ArrowRight as ArrowRightIcon, Edit as EditIcon, Search as SearchIcon} from 'react-feather';
import {Theme} from 'src/theme';
import {Dataset} from 'src/types/dataset';

interface ResultsProps {
    className?: string;
    datasets: Dataset[];
}

interface Filters {
    availability?: 'available' | 'unavailable';
    category?: string;
    inStock?: boolean;
    isShippable?: boolean;
}

const categoryOptions = [
    {
        id: 'all',
        name: 'All'
    },
    {
        id: 'dress',
        name: 'Dress'
    },
    {
        id: 'jewelry',
        name: 'Jewelry'
    },
    {
        id: 'blouse',
        name: 'Blouse'
    },
    {
        id: 'beauty',
        name: 'Beauty'
    }
];

const availabilityOptions = [
    {
        id: 'all',
        name: 'All'
    },
    {
        id: 'available',
        name: 'Available'
    },
    {
        id: 'unavailable',
        name: 'Unavailable'
    }
];

const sortOptions = [
    {
        value: 'updatedAt|desc',
        label: 'Last update (newest first)'
    },
    {
        value: 'updatedAt|asc',
        label: 'Last update (oldest first)'
    },
    {
        value: 'createdAt|desc',
        label: 'Creation date (newest first)'
    },
    {
        value: 'createdAt|asc',
        label: 'Creation date (oldest first)'
    }
];

const applyFilters = (datasets: Dataset[], query: string, filters: Filters): Dataset[] => {
    return datasets.filter((dataset) => {
        let matches = true;

        if (query && !dataset.name.toLowerCase().includes(query.toLowerCase())) {
            matches = false;
        }

        return matches;
    });
};

const applyPagination = (datasets: Dataset[], page: number, limit: number): Dataset[] => {
    return datasets.slice(page * limit, page * limit + limit);
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    bulkOperations: {
        position: 'relative'
    },
    bulkActions: {
        paddingLeft: 4,
        paddingRight: 4,
        marginTop: 6,
        position: 'absolute',
        width: '100%',
        zIndex: 2,
        backgroundColor: theme.palette.background.default
    },
    bulkAction: {
        marginLeft: theme.spacing(2)
    },
    queryField: {
        width: 500
    },
    categoryField: {
        flexBasis: 200
    },
    availabilityField: {
        marginLeft: theme.spacing(2),
        flexBasis: 200
    },
    stockField: {
        marginLeft: theme.spacing(2)
    },
    shippableField: {
        marginLeft: theme.spacing(2)
    },
    imageCell: {
        fontSize: 0,
        width: 68,
        flexBasis: 68,
        flexGrow: 0,
        flexShrink: 0
    },
    image: {
        height: 68,
        width: 68
    }
}));

const Results: FC<ResultsProps> = ({className, datasets, ...rest}) => {
    const classes = useStyles();
    const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(10);
    const [query, setQuery] = useState<string>('');
    const [sort, setSort] = useState<string>(sortOptions[0].value);
    const [filters, setFilters] = useState<Filters>({
        category: null,
        availability: null,
        inStock: null,
        isShippable: null
    });

    const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
        event.persist();
        setQuery(event.target.value);
    };

    const handleCategoryChange = (event: ChangeEvent<HTMLInputElement>): void => {
        event.persist();

        let value = null;

        if (event.target.value !== 'all') {
            value = event.target.value;
        }

        setFilters((prevFilters) => ({
            ...prevFilters,
            category: value
        }));
    };

    const handleAvailabilityChange = (event: ChangeEvent<HTMLInputElement>): void => {
        event.persist();

        let value = null;

        if (event.target.value !== 'all') {
            value = event.target.value;
        }

        setFilters((prevFilters) => ({
            ...prevFilters,
            availability: value
        }));
    };

    const handleStockChange = (event: ChangeEvent<HTMLInputElement>): void => {
        event.persist();

        let value = null;

        if (event.target.checked) {
            value = true;
        }

        setFilters((prevFilters) => ({
            ...prevFilters,
            inStock: value
        }));
    };

    const handleShippableChange = (event: ChangeEvent<HTMLInputElement>): void => {
        event.persist();

        let value = null;

        if (event.target.checked) {
            value = true;
        }

        setFilters((prevFilters) => ({
            ...prevFilters,
            isShippable: value
        }));
    };

    const handleSortChange = (event: ChangeEvent<HTMLInputElement>): void => {
        event.persist();
        setSort(event.target.value);
    };

    const handleSelectAllDatasets = (event: ChangeEvent<HTMLInputElement>): void => {
        setSelectedDatasets(event.target.checked
            ? datasets.map((dataset) => dataset.id)
            : []);
    };

    const handleSelectOneProduct = (event: ChangeEvent<HTMLInputElement>, datasetId: string): void => {
        if (!selectedDatasets.includes(datasetId)) {
            setSelectedDatasets((prevSelected) => [...prevSelected, datasetId]);
        } else {
            setSelectedDatasets((prevSelected) => prevSelected.filter((id) => id !== datasetId));
        }
    };

    const handlePageChange = (event: any, newPage: number): void => {
        setPage(newPage);
    };

    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLimit(parseInt(event.target.value));
    };

    // Usually query is done on backend with indexing solutions
    const filteredDatasets = applyFilters(datasets, query, filters);
    const paginatedDatasets = applyPagination(filteredDatasets, page, limit);
    const enableBulkOperations = selectedDatasets.length > 0;
    const selectedSomeDatasets = selectedDatasets.length > 0 && selectedDatasets.length < datasets.length;
    const selectedAllDatasets = selectedDatasets.length === datasets.length;

    return (
        <Card
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Box p={2}>
                <Box
                    display="flex"
                    alignItems="center"
                >
                    <TextField
                        className={classes.queryField}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SvgIcon
                                        fontSize="small"
                                        color="action"
                                    >
                                        <SearchIcon/>
                                    </SvgIcon>
                                </InputAdornment>
                            )
                        }}
                        onChange={handleQueryChange}
                        placeholder="Search datasets"
                        value={query}
                        variant="outlined"
                    />
                    <Box flexGrow={1}/>
                    <TextField
                        label="Sort By"
                        name="sort"
                        onChange={handleSortChange}
                        select
                        SelectProps={{native: true}}
                        value={sort}
                        variant="outlined"
                    >
                        {sortOptions.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        ))}
                    </TextField>
                </Box>
                <Box
                    mt={3}
                    display="flex"
                    alignItems="center"
                >
                    <TextField
                        className={classes.categoryField}
                        label="Category"
                        name="category"
                        onChange={handleCategoryChange}
                        select
                        SelectProps={{native: true}}
                        value={filters.category || 'all'}
                        variant="outlined"
                    >
                        {categoryOptions.map((categoryOption) => (
                            <option
                                key={categoryOption.id}
                                value={categoryOption.id}
                            >
                                {categoryOption.name}
                            </option>
                        ))}
                    </TextField>
                    <TextField
                        className={classes.availabilityField}
                        label="Availability"
                        name="availability"
                        onChange={handleAvailabilityChange}
                        select
                        SelectProps={{native: true}}
                        value={filters.availability || 'all'}
                        variant="outlined"
                    >
                        {availabilityOptions.map((avalabilityOption) => (
                            <option
                                key={avalabilityOption.id}
                                value={avalabilityOption.id}
                            >
                                {avalabilityOption.name}
                            </option>
                        ))}
                    </TextField>
                    <FormControlLabel
                        className={classes.stockField}
                        control={(
                            <Checkbox
                                checked={!!filters.inStock}
                                onChange={handleStockChange}
                                name="inStock"
                            />
                        )}
                        label="In Stock"
                    />
                    <FormControlLabel
                        className={classes.shippableField}
                        control={(
                            <Checkbox
                                checked={!!filters.isShippable}
                                onChange={handleShippableChange}
                                name="Shippable"
                            />
                        )}
                        label="Shippable"
                    />
                </Box>
            </Box>
            {enableBulkOperations && (
                <div className={classes.bulkOperations}>
                    <div className={classes.bulkActions}>
                        <Checkbox
                            checked={selectedAllDatasets}
                            indeterminate={selectedSomeDatasets}
                            onChange={handleSelectAllDatasets}
                        />
                        <Button
                            variant="outlined"
                            className={classes.bulkAction}
                        >
                            Delete
                        </Button>
                        <Button
                            variant="outlined"
                            className={classes.bulkAction}
                        >
                            Edit
                        </Button>
                    </div>
                </div>
            )}
            <PerfectScrollbar>
                <Box minWidth={1200}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedAllDatasets}
                                        indeterminate={selectedSomeDatasets}
                                        onChange={handleSelectAllDatasets}
                                    />
                                </TableCell>
                                <TableCell/>
                                <TableCell>
                                    Name
                                </TableCell>
                                <TableCell>
                                    Inventory
                                </TableCell>
                                <TableCell>
                                    Details
                                </TableCell>
                                <TableCell>
                                    Attributes
                                </TableCell>
                                <TableCell>
                                    Price
                                </TableCell>
                                <TableCell align="right">
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedDatasets.map((dataset) => {
                                const isProductSelected = selectedDatasets.includes(dataset.id);

                                return (
                                    <TableRow
                                        hover
                                        key={dataset.id}
                                        selected={isProductSelected}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={isProductSelected}
                                                onChange={(event) => handleSelectOneProduct(event, dataset.id)}
                                                value={isProductSelected}
                                            />
                                        </TableCell>
                                        <TableCell className={classes.imageCell}>
                                            ...
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                variant="subtitle2"
                                                color="textPrimary"
                                                component={RouterLink}
                                                underline="none"
                                                to="#"
                                            >
                                                {dataset.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            :/
                                        </TableCell>
                                        <TableCell>
                                            4
                                            {' '}
                                            in stock
                                            ...
                                        </TableCell>
                                        <TableCell>
                                            ...
                                        </TableCell>
                                        <TableCell>
                                            4
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton>
                                                <SvgIcon fontSize="small">
                                                    <EditIcon/>
                                                </SvgIcon>
                                            </IconButton>
                                            <IconButton>
                                                <SvgIcon fontSize="small">
                                                    <ArrowRightIcon/>
                                                </SvgIcon>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    <TablePagination
                        component="div"
                        count={filteredDatasets.length}
                        onChangePage={handlePageChange}
                        onChangeRowsPerPage={handleLimitChange}
                        page={page}
                        rowsPerPage={limit}
                        rowsPerPageOptions={[5, 10, 25]}
                    />
                </Box>
            </PerfectScrollbar>
        </Card>
    );
};

Results.propTypes = {
    className: PropTypes.string,
    datasets: PropTypes.array.isRequired
};

Results.defaultProps = {
    datasets: []
};

export default Results;
