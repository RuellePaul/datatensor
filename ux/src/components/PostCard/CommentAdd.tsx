import React, {
  useRef,
  useState
} from 'react';
import type { FC, ChangeEvent } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Avatar,
  Divider,
  IconButton,
  Input,
  Paper,
  Tooltip,
  makeStyles
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import AddPhotoIcon from '@material-ui/icons/AddPhotoAlternate';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import useAuth from 'src/hooks/useAuth';
import type { Theme } from 'src/theme';

interface CommentAddProps {
  className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    alignItems: 'center',
    display: 'flex'
  },
  inputContainer: {
    flexGrow: 1,
    marginLeft: theme.spacing(2),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    paddingTop: theme.spacing(0.5)
  },
  divider: {
    height: 24,
    width: 1
  },
  fileInput: {
    display: 'none'
  }
}));

const CommentAdd: FC<CommentAddProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setValue(event.target.value);
  };

  const handleAttach = (): void => {
    fileInputRef.current.click();
  };

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Avatar
        alt="Person"
        src={user.avatar}
      />
      <Paper
        className={classes.inputContainer}
        variant="outlined"
      >
        <Input
          disableUnderline
          fullWidth
          onChange={handleChange}
          placeholder="Leave a message"
        />
      </Paper>
      <Tooltip title="Send">
        <IconButton color={value.length > 0 ? 'primary' : 'default'}>
          <SendIcon />
        </IconButton>
      </Tooltip>
      <Divider className={classes.divider} />
      <Tooltip title="Attach image">
        <IconButton
          edge="end"
          onClick={handleAttach}
        >
          <AddPhotoIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Attach file">
        <IconButton
          edge="end"
          onClick={handleAttach}
        >
          <AttachFileIcon />
        </IconButton>
      </Tooltip>
      <input
        className={classes.fileInput}
        ref={fileInputRef}
        type="file"
      />
    </div>
  );
};

CommentAdd.propTypes = {
  className: PropTypes.string
};

export default CommentAdd;
