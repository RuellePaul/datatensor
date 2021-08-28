import React, {ChangeEvent, FC, KeyboardEvent, useCallback, useEffect, useState} from 'react';
import clsx from 'clsx';
import {Box, Card, Checkbox, Chip, Divider, FormControlLabel, Input, makeStyles} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import {Theme} from 'src/theme';
import api from 'src/utils/api';

interface FilterProps {
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    searchInput: {
        marginLeft: theme.spacing(2)
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
    const [inputValue, setInputValue] = useState<string>('');
    const [chips, setChips] = useState<string[]>([
        'Cat',
        'Dog',
        'Human',
        'Bicycle'
    ]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        event.persist();
        setInputValue(event.target.value);
    };

    const handleInputKeyup = (event: KeyboardEvent<HTMLInputElement>): void => {
        event.persist();

        if (event.keyCode === 13 && inputValue) {
            if (!chips.includes(inputValue)) {
                setChips((prevChips) => [...prevChips, inputValue]);
                setInputValue('');
            }
        }
    };

    const handleChipDelete = (chip: string): void => {
        setChips((prevChips) => prevChips.filter((prevChip) => chip !== prevChip));
    };

    const searchDatasets = useCallback(async (category_names) => {
        if (category_names.length === 0) return;

        await api.post<{ dataset_ids: string[] }>('/search/datasets', {category_names});
    }, []);

    useEffect(() => {
        searchDatasets(chips)
    }, [chips, searchDatasets]);

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
                <SearchIcon/>
                <Input
                    disableUnderline
                    fullWidth
                    className={classes.searchInput}
                    onChange={handleInputChange}
                    onKeyUp={handleInputKeyup}
                    placeholder="Search a category"
                    value={inputValue}
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
            <Divider/>
            <Box
                p={2}
                display="flex"
                alignItems="center"
                flexWrap="wrap"
            >
                {chips.map((chip) => (
                    <Chip
                        className={classes.chip}
                        key={chip}
                        label={chip}
                        onDelete={() => handleChipDelete(chip)}
                    />
                ))}
            </Box>
        </Card>
    );
};

export default Filter;
