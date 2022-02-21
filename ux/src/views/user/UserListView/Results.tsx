import React, {ChangeEvent, FC, useState} from 'react';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import clsx from 'clsx';
import moment from 'moment';
import {
    Box,
    Button,
    Card,
    Checkbox,
    Divider,
    InputAdornment,
    Link,
    SvgIcon,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Tabs,
    TextField,
    Typography
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {Search as SearchIcon} from 'react-feather';
import FancyLabel from 'src/components/FancyLabel';
import UserAvatar from 'src/components/UserAvatar';
import useAuth from 'src/hooks/useAuth';
import {Theme} from 'src/theme';
import {User} from 'src/types/user';
import api from 'src/utils/api';

interface ResultsProps {
    className?: string;
    users: User[];
    setUsers: any;
}

type Sort = 'created_at|desc' | 'created_at|asc';

interface SortOption {
    value: Sort;
    label: string;
}

const tabs = [
    {
        value: 'all',
        label: 'All'
    },
    {
        value: 'is_admin',
        label: 'Admin only'
    }
];

const sortOptions: SortOption[] = [
    {
        value: 'created_at|desc',
        label: 'Last register (newest first)'
    },
    {
        value: 'created_at|asc',
        label: 'Last register (oldest first)'
    }
];

const applyFilters = (users: User[], query: string, filters: any): User[] => {
    return users.filter(user => {
        let matches = true;

        if (query) {
            const properties = ['email', 'name'];
            let containsQuery = false;

            properties.forEach(property => {
                if (user[property] && user[property].toLowerCase().includes(query.toLowerCase())) {
                    containsQuery = true;
                }
            });

            if (!containsQuery) {
                matches = false;
            }
        }

        Object.keys(filters).forEach(key => {
            const value = filters[key];

            if (value && user[key] !== value) {
                matches = false;
            }
        });

        return matches;
    });
};

const applyPagination = (users: User[], page: number, limit: number): User[] => {
    return users.slice(page * limit, page * limit + limit);
};

const descendingComparator = (a: User, b: User, orderBy: string): number => {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }

    if (b[orderBy] > a[orderBy]) {
        return 1;
    }

    return 0;
};

const getComparator = (order: 'asc' | 'desc', orderBy: string) => {
    return order === 'desc'
        ? (a: User, b: User) => descendingComparator(a, b, orderBy)
        : (a: User, b: User) => -descendingComparator(a, b, orderBy);
};

const applySort = (users: User[], sort: Sort): User[] => {
    const [orderBy, order] = sort.split('|') as [string, 'asc' | 'desc'];
    const comparator = getComparator(order, orderBy);
    const stabilizedThis = users.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        // @ts-ignore
        const order = comparator(a[0], b[0]);

        if (order !== 0) return order;

        // @ts-ignore
        return a[1] - b[1];
    });

    // @ts-ignore
    return stabilizedThis.map(el => el[0]);
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    queryField: {
        width: 500
    },
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
    red: {
        color: theme.palette.error.light,
        borderColor: theme.palette.error.light,
        '&:hover': {
            color: theme.palette.error.main,
            borderColor: theme.palette.error.main
        }
    },
    row: {
        cursor: 'pointer'
    },
    avatar: {
        height: 42,
        width: 42,
        marginRight: theme.spacing(1)
    }
}));

const Results: FC<ResultsProps> = ({className, users, setUsers, ...rest}) => {
    const classes = useStyles();
    const {user: admin} = useAuth();
    const history = useHistory();
    const [currentTab, setCurrentTab] = useState<string>('all');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(10);
    const [query, setQuery] = useState<string>('');
    const [sort, setSort] = useState<Sort>(sortOptions[0].value);
    const [filters, setFilters] = useState<any>({
        is_admin: null
    });

    const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
        const updatedFilters = {
            ...filters,
            is_admin: null
        };

        if (value !== 'all') {
            updatedFilters[value] = true;
        }

        setFilters(updatedFilters);
        setSelectedUsers([]);
        setCurrentTab(value);
    };

    const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
        event.persist();
        setQuery(event.target.value);
    };

    const handleSortChange = (event: ChangeEvent<HTMLInputElement>): void => {
        event.persist();
        setSort(event.target.value as Sort);
    };

    const handleSelectAllUsers = (event: ChangeEvent<HTMLInputElement>): void => {
        setSelectedUsers(event.target.checked ? users.filter(user => user.id !== admin.id).map(user => user.id) : []);
    };

    const handleSelectOneUser = (event: any, customerId: string): void => {
        if (customerId === admin.id) return;
        if (!selectedUsers.includes(customerId)) {
            setSelectedUsers(prevSelected => [...prevSelected, customerId]);
        } else {
            setSelectedUsers(prevSelected => prevSelected.filter(id => id !== customerId));
        }
    };

    const handleDeleteSelectedUsers = async () => {
        await api.delete('/users/', {data: {user_ids: selectedUsers}});
        setUsers(users => users.filter(user => !selectedUsers.includes(user.id)));
        setSelectedUsers([]);
    };

    const handlePageChange = (event: any, newPage: number): void => {
        setPage(newPage);
    };

    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLimit(parseInt(event.target.value));
    };

    const filteredUsers = applyFilters(users, query, filters);
    const sortedUsers = applySort(filteredUsers, sort);
    const paginatedUsers = applyPagination(sortedUsers, page, limit);
    const enableBulkOperations = selectedUsers.length > 0;
    const selectedSomeUsers = selectedUsers.length > 0 && selectedUsers.length < users.length - 1;
    const selectedAllUsers = selectedUsers.length === users.length - 1;

    return (
        <Card className={clsx(classes.root, className)} {...rest}>
            <Tabs
                onChange={handleTabsChange}
                scrollButtons="auto"
                textColor="primary"
                value={currentTab}
                variant="scrollable"
            >
                {tabs.map(tab => (
                    <Tab key={tab.value} value={tab.value} label={tab.label} />
                ))}
            </Tabs>
            <Divider />
            <Box p={2} minHeight={56} display="flex" alignItems="center">
                <TextField
                    className={classes.queryField}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SvgIcon fontSize="small" color="action">
                                    <SearchIcon />
                                </SvgIcon>
                            </InputAdornment>
                        )
                    }}
                    onChange={handleQueryChange}
                    placeholder="Search users"
                    value={query}
                    variant="outlined"
                />
                <Box flexGrow={1} />
                <TextField
                    label="Sort By"
                    name="sort"
                    onChange={handleSortChange}
                    select
                    SelectProps={{native: true}}
                    value={sort}
                    variant="outlined"
                >
                    {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </TextField>
            </Box>
            {enableBulkOperations && (
                <div className={classes.bulkOperations}>
                    <div className={classes.bulkActions}>
                        <Checkbox
                            checked={selectedAllUsers}
                            indeterminate={selectedSomeUsers}
                            onChange={handleSelectAllUsers}
                        />
                        {selectedUsers.length === 1 && (
                            <Button
                                className={classes.bulkAction}
                                variant="outlined"
                                onClick={() => history.push(`/users/${selectedUsers[0]}`)}
                            >
                                View details
                            </Button>
                        )}
                        <Button
                            className={clsx(classes.bulkAction, classes.red)}
                            variant="outlined"
                            onClick={handleDeleteSelectedUsers}
                        >
                            Delete
                            {selectedUsers.length > 1 && ` ${selectedUsers.length} users`}
                        </Button>
                    </div>
                </div>
            )}
            <Box minWidth={700}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectedAllUsers}
                                    indeterminate={selectedSomeUsers}
                                    onChange={handleSelectAllUsers}
                                />
                            </TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Created at</TableCell>
                            <TableCell>Verified</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedUsers.map(user => {
                            const isUserSelected = selectedUsers.includes(user.id);

                            return (
                                <TableRow
                                    className={classes.row}
                                    hover
                                    key={user.id}
                                    selected={isUserSelected}
                                    onClick={event => handleSelectOneUser(event, user.id)}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isUserSelected}
                                            onChange={event => handleSelectOneUser(event, user.id)}
                                            onClick={event => event.stopPropagation()}
                                            value={isUserSelected}
                                            disabled={user.id === admin.id}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center">
                                            <UserAvatar user={user} className={classes.avatar} />
                                            <Box ml={1}>
                                                <Link
                                                    color="inherit"
                                                    component={RouterLink}
                                                    to={`/users/${user.id}`}
                                                    variant="h6"
                                                >
                                                    {user.name}
                                                </Link>
                                                <Typography variant="body2" color="textSecondary">
                                                    {user.email}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <FancyLabel color={user.is_verified ? 'success' : 'error'}>
                                            {user.is_verified ? 'Email verified' : 'Email not verified'}
                                        </FancyLabel>
                                    </TableCell>
                                    <TableCell>{moment(user.created_at).format('DD/MM/YYYY | HH:mm:ss')}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Box>
            <TablePagination
                component="div"
                count={filteredUsers.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </Card>
    );
};

Results.defaultProps = {
    users: []
};

export default Results;
