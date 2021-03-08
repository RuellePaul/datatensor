import React, { useState } from 'react';
import type {
  ChangeEvent,
  FC,
  FocusEvent
} from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/core';
import type { Contact } from 'src/types/chat';
import axios from 'src/utils/axios';
import Search from './Search';
import ThreadList from './ThreadList';

const useStyles = makeStyles(() => ({
  hideThreadList: {
    display: 'none'
  }
}));

const RecentThreads: FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const [isSearchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Contact[]>([]);

  const handleSearchClickAway = (): void => {
    setSearchFocused(false);
    setSearchQuery('');
  };

  const handleSearchChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    try {
      event.persist();

      const { value } = event.target;

      setSearchQuery(value);

      if (value) {
        const response = await axios.get<{ results: any[]; }>('/api/chat/search', {
          params: {
            query: value
          }
        });

        setSearchResults(response.data.results);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchFocus = (event: FocusEvent<HTMLInputElement>): void => {
    event.persist();
    setSearchFocused(true);
  };

  const handleSearchSelect = (result: any): void => {
    setSearchFocused(false);
    setSearchQuery('');
    history.push(`/app/chat/${result.username}`);
  };

  return (
    <PerfectScrollbar options={{ suppressScrollX: true }}>
      <Search
        isFocused={isSearchFocused}
        onChange={handleSearchChange}
        onClickAway={handleSearchClickAway}
        onFocus={handleSearchFocus}
        onSelect={handleSearchSelect}
        query={searchQuery}
        results={searchResults}
      />
      <ThreadList className={clsx({ [classes.hideThreadList]: isSearchFocused })} />
    </PerfectScrollbar>
  );
};

export default RecentThreads;
