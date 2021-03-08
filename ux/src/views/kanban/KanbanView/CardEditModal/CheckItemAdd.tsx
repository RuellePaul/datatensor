import React, { useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  makeStyles,
  TextField
} from '@material-ui/core';
import { useDispatch } from 'src/store';
import { addCheckItem } from 'src/slices/kanban';
import type { Card, Checklist } from 'src/types/kanban';

interface CheckItemAddProps {
  className?: string;
  card: Card;
  checklist: Checklist;
}

const useStyles = makeStyles(() => ({
  root: {}
}));

const CheckItemAdd: FC<CheckItemAddProps> = ({
  card,
  checklist,
  className,
  ...rest
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [name, setName] = useState<string>('');
  const [isExpanded, setExpanded] = useState<boolean>(false);

  const handleAdd = (): void => {
    setExpanded(true);
  };

  const handleCancel = (): void => {
    setExpanded(false);
    setName('');
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setName(event.target.value);
  };

  const handleSave = async (): Promise<void> => {
    try {
      if (!name) {
        return;
      }

      await dispatch(addCheckItem(card.id, checklist.id, name));
      setExpanded(false);
      setName('');
      enqueueSnackbar('Check item added', {
        variant: 'success'
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Something went wrong', {
        variant: 'error'
      });
    }
  };

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      {isExpanded ? (
        <div>
          <TextField
            fullWidth
            onChange={handleChange}
            placeholder="Add an item"
            value={name}
            variant="outlined"
          />
          <Box mt={1}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              size="small"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Box>
        </div>
      ) : (
        <Button
          variant="outlined"
          size="small"
          onClick={handleAdd}
        >
          Add an item
        </Button>
      )}
    </div>
  );
};

CheckItemAdd.propTypes = {
  // @ts-ignore
  card: PropTypes.object.isRequired,
  // @ts-ignore
  checklist: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default CheckItemAdd;
