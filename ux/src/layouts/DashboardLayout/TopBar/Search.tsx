import React, {FC, useState} from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {useSnackbar} from 'notistack';
import {
    Box,
    Button,
    CircularProgress,
    Drawer,
    IconButton,
    InputAdornment,
    makeStyles,
    SvgIcon,
    TextField,
    Tooltip,
    Typography
} from '@material-ui/core';
import {Search as SearchIcon, XCircle as XIcon} from 'react-feather';
import api from 'src/utils/api';

interface SearchResult {
    datasets: object;
    images: object;
    users: object;
    categories: object;
}

const useStyles = makeStyles(() => ({
    drawer: {
        width: 500,
        maxWidth: '100%'
    }
}));

const Search: FC = () => {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const [value, setValue] = useState<string>('');
    const [isOpen, setOpen] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [result, setResult] = useState<SearchResult | null>(null);

    const handleOpen = (): void => {
        setOpen(true);
    };

    const handleClose = (): void => {
        setOpen(false);
    };

    const handleSearch = async (): Promise<void> => {
        try {
            setLoading(true);

            const response = await api.get<{ result: SearchResult; }>('/search/', {params: {query: value}});
            setResult(response.data.result);
        } catch (error) {
            enqueueSnackbar(error?.message || 'Something went wrong', {
                variant: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Tooltip title="Search">
                <IconButton
                    color="inherit"
                    onClick={handleOpen}
                >
                    <SvgIcon fontSize="small">
                        <SearchIcon/>
                    </SvgIcon>
                </IconButton>
            </Tooltip>
            <Drawer
                anchor="right"
                classes={{paper: classes.drawer}}
                ModalProps={{BackdropProps: {invisible: true}}}
                onClose={handleClose}
                open={isOpen}
                variant="temporary"
            >
                <PerfectScrollbar options={{suppressScrollX: true}}>
                    <Box p={3}>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Typography
                                variant="h4"
                                color="textPrimary"
                            >
                                Search
                            </Typography>
                            <IconButton onClick={handleClose}>
                                <SvgIcon fontSize="small">
                                    <XIcon/>
                                </SvgIcon>
                            </IconButton>
                        </Box>
                        <Box mt={2}>
                            <TextField
                                fullWidth
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
                                onChange={(event) => setValue(event.target.value)}
                                placeholder="Search image datasets, categories and more..."
                                value={value}
                                variant="outlined"
                            />
                        </Box>
                        <Box
                            mt={2}
                            display="flex"
                            justifyContent="flex-end"
                        >
                            <Button
                                color="secondary"
                                variant="contained"
                                onClick={handleSearch}
                            >
                                Search
                            </Button>
                        </Box>
                        <Box mt={4}>
                            {isLoading ? (
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                >
                                    <CircularProgress/>
                                </Box>
                            ) : (
                                <pre>
                                    {JSON.stringify(result, null, 4)}
                                </pre>
                            )}
                        </Box>
                    </Box>
                </PerfectScrollbar>
            </Drawer>
        </>
    );
};

export default Search;
