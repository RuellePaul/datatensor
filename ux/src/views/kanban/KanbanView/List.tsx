import React, {
  useState,
  useRef
} from 'react';
import type { FC, ChangeEvent } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import {
  Droppable,
  Draggable
} from 'react-beautiful-dnd';
import {
  Box,
  ClickAwayListener,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  SvgIcon,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import { MoreVertical as MoreIcon } from 'react-feather';
import type { Theme } from 'src/theme';
import { useDispatch, useSelector } from 'src/store';
import type { RootState } from 'src/store';
import {
  clearList,
  deleteList,
  updateList
} from 'src/slices/kanban';
import type { List as ListType } from 'src/types/kanban';
import Card from './Card';
import CardAdd from './CardAdd';

interface ListProps {
  className?: string;
  listId: string;
}

const listSelector = (state: RootState, listId: string): ListType => {
  const { lists } = state.kanban;

  return lists.byId[listId];
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  inner: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '100%',
    overflowY: 'hidden',
    overflowX: 'hidden',
    width: 380,
    [theme.breakpoints.down('xs')]: {
      width: 300
    }
  },
  title: {
    cursor: 'pointer'
  },
  droppableArea: {
    minHeight: 80,
    flexGrow: 1,
    overflowY: 'auto',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  menu: {
    width: 240
  }
}));

const List: FC<ListProps> = ({ className, listId, ...rest }) => {
  const classes = useStyles();
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
  const list = useSelector((state) => listSelector(state, listId));
  const dispatch = useDispatch();
  const moreRef = useRef<HTMLButtonElement | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [name, setName] = useState<string>(list.name);
  const [isRenaming, setRenaming] = useState<boolean>(false);

  const handleMenuOpen = (): void => {
    setMenuOpen(true);
  };

  const handleMenuClose = (): void => {
    setMenuOpen(false);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setName(event.target.value);
  };

  const handleRenameInit = (): void => {
    setRenaming(true);
    setMenuOpen(false);
  };

  const handleRename = async (): Promise<void> => {
    try {
      if (!name) {
        setName(list.name);
        setRenaming(false);
        return;
      }

      const update = { name };

      setRenaming(false);
      await dispatch(updateList(list.id, update));
      enqueueSnackbar('List updated', {
        variant: 'success'
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Something went wrong', {
        variant: 'error'
      });
    }
  };

  const handleDelete = async (): Promise<void> => {
    try {
      setMenuOpen(false);
      await dispatch(deleteList(list.id));
      enqueueSnackbar('List deleted', {
        variant: 'success'
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Something went wrong', {
        variant: 'error'
      });
    }
  };

  const handleClear = async (): Promise<void> => {
    try {
      setMenuOpen(false);
      await dispatch(clearList(list.id));
      enqueueSnackbar('List cleared', {
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
      <Paper className={classes.inner}>
        <Box
          py={1}
          px={2}
          display="flex"
          alignItems="center"
        >
          {isRenaming ? (
            <ClickAwayListener onClickAway={handleRename}>
              <TextField
                value={name}
                onBlur={handleRename}
                onChange={handleChange}
                variant="outlined"
                margin="dense"
              />
            </ClickAwayListener>
          ) : (
            <Typography
              color="inherit"
              variant="h5"
              onClick={handleRenameInit}
            >
              {list.name}
            </Typography>
          )}
          <Box flexGrow={1} />
          <IconButton
            color="inherit"
            edge="end"
            onClick={handleMenuOpen}
            ref={moreRef}
          >
            <SvgIcon fontSize="small">
              <MoreIcon />
            </SvgIcon>
          </IconButton>
        </Box>
        <Divider />
        <Droppable
          droppableId={list.id}
          type="card"
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              className={classes.droppableArea}
            >
              {list.cardIds.map((cardId, index) => (
                <Draggable
                  draggableId={cardId}
                  index={index}
                  key={cardId}
                >
                  {(provided, snapshot) => (
                    <Card
                      cardId={cardId}
                      dragging={snapshot.isDragging}
                      index={index}
                      key={cardId}
                      list={list}
                      // @ts-ignore
                      ref={provided.innerRef}
                      style={{ ...provided.draggableProps.style }}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <Divider />
        <Box p={2}>
          <CardAdd listId={list.id} />
        </Box>
        <Menu
          keepMounted
          anchorEl={moreRef.current}
          open={isMenuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          PaperProps={{ className: classes.menu }}
          getContentAnchorEl={null}
        >
          <MenuItem onClick={handleRenameInit}>
            Rename
          </MenuItem>
          <MenuItem onClick={handleClear}>
            Clear
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            Delete
          </MenuItem>
        </Menu>
      </Paper>
    </div>
  );
};

List.propTypes = {
  className: PropTypes.string,
  listId: PropTypes.string.isRequired
};

export default List;
