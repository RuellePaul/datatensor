import React, { useState } from 'react';
import type {
  FC,
  ChangeEvent,
  KeyboardEvent
} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Card,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  Input,
  makeStyles
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import type { Theme } from 'src/theme';
import MultiSelect from './MultiSelect';

interface FilterProps {
  className?: string;
}

const selectOptions = [
  {
    label: 'Type',
    options: [
      'Freelance',
      'Full Time',
      'Part Time',
      'Internship']
  },
  {
    label: 'Level',
    options: ['Novice', 'Expert']
  },
  {
    label: 'Location',
    options: [
      'Africa',
      'Asia',
      'Australia',
      'Europe',
      'North America',
      'South America'
    ]
  },
  {
    label: 'Roles',
    options: ['Android', 'Web Developer', 'iOS']
  }
];

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  searchInput: {
    marginLeft: theme.spacing(2)
  },
  chip: {
    margin: theme.spacing(1)
  }
}));

const Filter: FC<FilterProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const [inputValue, setInputValue] = useState<string>('');
  const [chips, setChips] = useState<string[]>([
    'Freelance',
    'Full Time',
    'Novice',
    'Europe',
    'Android',
    'Web Developer'
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

  const handleMultiSelectChange = (value: string[]): void => {
    setChips(value);
  };

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
        <SearchIcon />
        <Input
          disableUnderline
          fullWidth
          className={classes.searchInput}
          onChange={handleInputChange}
          onKeyUp={handleInputKeyup}
          placeholder="Enter a keyword"
          value={inputValue}
        />
      </Box>
      <Divider />
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
      <Divider />
      <Box
        display="flex"
        alignItems="center"
        flexWrap="wrap"
        p={1}
      >
        {selectOptions.map((option) => (
          <MultiSelect
            key={option.label}
            label={option.label}
            onChange={handleMultiSelectChange}
            options={option.options}
            value={chips}
          />
        ))}
        <Box flexGrow={1} />
        <FormControlLabel
          control={(
            <Checkbox defaultChecked />
          )}
          label="In network"
        />
      </Box>
    </Card>
  );
};

Filter.propTypes = {
  className: PropTypes.string
};

export default Filter;
