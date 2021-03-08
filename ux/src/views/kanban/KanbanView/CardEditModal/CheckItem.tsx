import React, { useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  SvgIcon,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import { Trash as TrashIcon } from 'react-feather';
import type { Theme } from 'src/theme';
import { useDispatch } from 'src/store';
import {
  updateCheckItem,
  deleteCheckItem
} from 'src/slices/kanban';
import type {
  Card,
  Checklist,
  CheckItem as CheckItemType
} from 'src/types/kanban';

interface CheckItemProps {
  className?: string;
  card: Card;
  checklist: Checklist;
  checkItem: CheckItemType;
  editing?: boolean;
  onEditCancel?: () => void;
  onEditComplete?: () => void;
  onEditInit?: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'flex-start',
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: theme.palette.background.dark,
      '& $deleteButton': {
        visibility: 'visible'
      }
    }
  },
  checkbox: {
    marginLeft: theme.spacing(-1),
    marginRight: theme.spacing(1)
  },
  name: {
    flexGrow: 1,
    cursor: 'pointer',
    minHeight: 32
  },
  deleteButton: {
    visibility: 'hidden'
  }
}));

const CheckItem: FC<CheckItemProps> = ({
  card,
  checklist,
  checkItem,
  className,
  editing,
  onEditCancel,
  onEditInit,
  onEditComplete,
  ...rest
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [name, setName] = useState<string>(checkItem.name);

  const handleStateChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    try {
      event.persist();

      const state = event.target.checked ? 'complete' : 'incomplete';

      await dispatch(updateCheckItem(
        card.id,
        checklist.id,
        checkItem.id,
        { state }
      ));
      enqueueSnackbar('Check item updated', {
        variant: 'success'
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Something went wrong', {
        variant: 'error'
      });
    }
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setName(event.target.value);
  };

  const handleSave = async (): Promise<void> => {
    try {
      await dispatch(updateCheckItem(
        card.id,
        checklist.id,
        checkItem.id,
        { name }
      ));
      onEditComplete();
      enqueueSnackbar('Check item updated', {
        variant: 'success'
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Something went wrong', {
        variant: 'error'
      });
    }
  };

  const handleCancel = (): void => {
    setName(checkItem.name);
    onEditCancel();
  };

  const handleDelete = async (): Promise<void> => {
    try {
      await dispatch(deleteCheckItem(
        card.id,
        checklist.id,
        checkItem.id
      ));
      enqueueSnackbar('Check item deleted', {
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
      <Checkbox
        checked={checkItem.state === 'complete'}
        onChange={handleStateChange}
        className={classes.checkbox}
      />
      {editing ? (
        <Box flexGrow={1}>
          <TextField
            value={name}
            variant="outlined"
            fullWidth
            onChange={handleNameChange}
          />
          <Box mt={1}>
            <Button
              size="small"
              variant="contained"
              color="secondary"
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
        </Box>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          flexGrow={1}
        >
          <Typography
            onClick={onEditInit}
            color="textPrimary"
            variant="body1"
            className={classes.name}
          >
            {checkItem.name}
          </Typography>
          <IconButton
            onClick={handleDelete}
            className={classes.deleteButton}
          >
            <SvgIcon fontSize="small">
              <TrashIcon />
            </SvgIcon>
          </IconButton>
        </Box>
      )}
    </div>
  );
};

CheckItem.propTypes = {
  // @ts-ignore
  card: PropTypes.object.isRequired,
  // @ts-ignore
  checklist: PropTypes.object.isRequired,
  // @ts-ignore
  checkItem: PropTypes.object.isRequired,
  className: PropTypes.string,
  editing: PropTypes.bool,
  onEditCancel: PropTypes.func,
  onEditComplete: PropTypes.func,
  onEditInit: PropTypes.func
};

CheckItem.defaultProps = {
  editing: false,
  onEditCancel: () => {},
  onEditComplete: () => {},
  onEditInit: () => {}
};

export default CheckItem;
