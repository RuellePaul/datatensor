import React, { useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  LinearProgress,
  Typography,
  TextField,
  SvgIcon,
  makeStyles
} from '@material-ui/core';
import { List as ListIcon } from 'react-feather';
import type { Theme } from 'src/theme';
import { useDispatch } from 'src/store';
import {
  updateChecklist,
  deleteChecklist
} from 'src/slices/kanban';
import type {
  Card,
  Checklist as ChecklistType
} from 'src/types/kanban';
import CheckItem from './CheckItem';
import CheckItemAdd from './CheckItemAdd';

interface ChecklistProps {
  className?: string;
  card: Card;
  checklist: ChecklistType;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  listIcon: {
    marginRight: theme.spacing(3)
  }
}));

const Checklist: FC<ChecklistProps> = ({
  card,
  checklist,
  className,
  ...rest
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [name, setName] = useState<string>(checklist.name);
  const [editingName, setEditingName] = useState<boolean>(false);
  const [editingCheckItem, setEditingCheckItem] = useState<string | null>(null);

  const handleNameEdit = (): void => {
    setEditingName(true);
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setName(event.target.value);
  };

  const handleNameSave = async (): Promise<void> => {
    try {
      if (!name || name === checklist.name) {
        setEditingName(false);
        setName(checklist.name);
        return;
      }

      setEditingName(false);
      await dispatch(updateChecklist(card.id, checklist.id, { name }));
      enqueueSnackbar('Checklist updated', {
        variant: 'success'
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Something went wrong', {
        variant: 'error'
      });
    }
  };

  const handleNameCancel = (): void => {
    setEditingName(false);
    setName(checklist.name);
  };

  const handleDelete = async (): Promise<void> => {
    try {
      await dispatch(deleteChecklist(card.id, checklist.id));
      enqueueSnackbar('Checklist deleted', {
        variant: 'success'
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Something went wrong', {
        variant: 'error'
      });
    }
  };

  const handleCheckItemEditInit = (checkItemId: string): void => {
    setEditingCheckItem(checkItemId);
  };

  const handleCheckItemEditCancel = (): void => {
    setEditingCheckItem(null);
  };

  const handleCheckItemEditComplete = (): void => {
    setEditingCheckItem(null);
  };

  const totalCheckItems = checklist.checkItems.length;
  const completedCheckItems = (checklist.checkItems.filter((checkItem) => checkItem.state === 'complete')).length;
  const completePercentage = totalCheckItems === 0
    ? 100
    : (completedCheckItems / totalCheckItems) * 100;

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box
        display="flex"
      >
        <SvgIcon
          fontSize="small"
          color="action"
          className={classes.listIcon}
        >
          <ListIcon />
        </SvgIcon>
        {editingName ? (
          <Box flexGrow={1}>
            <TextField
              value={name}
              fullWidth
              variant="outlined"
              onChange={handleNameChange}
            />
            <Box mt={1}>
              <Button
                color="primary"
                size="small"
                variant="contained"
                onClick={handleNameSave}
              >
                Save
              </Button>
              <Button
                size="small"
                onClick={handleNameCancel}
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
              variant="h4"
              color="textPrimary"
              onClick={handleNameEdit}
            >
              {checklist.name}
            </Typography>
            <Box flexGrow={1} />
            <Button
              size="small"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Box>
        )}
      </Box>
      <Box
        mt={1}
        display="flex"
        alignItems="center"
      >
        <Typography
          variant="caption"
          color="textSecondary"
        >
          {Math.round(completePercentage)}
          %
        </Typography>
        <Box
          ml={2}
          flexGrow={1}
        >
          <LinearProgress
            variant="determinate"
            value={completePercentage}
            color="secondary"
          />
        </Box>
      </Box>
      <Box mt={3}>
        {checklist.checkItems.map((checkItem) => (
          <CheckItem
            editing={editingCheckItem === checkItem.id}
            checkItem={checkItem}
            card={card}
            checklist={checklist}
            key={checkItem.id}
            onEditCancel={handleCheckItemEditCancel}
            onEditComplete={handleCheckItemEditComplete}
            onEditInit={() => handleCheckItemEditInit(checkItem.id)}
          />
        ))}
      </Box>
      <Box
        mt={1}
        ml={6}
      >
        <CheckItemAdd
          card={card}
          checklist={checklist}
        />
      </Box>
    </div>
  );
};

Checklist.propTypes = {
  className: PropTypes.string,
  // @ts-ignore
  card: PropTypes.object.isRequired,
  // @ts-ignore
  checklist: PropTypes.object.isRequired
};

export default Checklist;
