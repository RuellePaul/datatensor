import React, {
  useRef,
  useState
} from 'react';
import type { FC, ChangeEvent } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Paper,
  TextareaAutosize,
  Tooltip,
  makeStyles
} from '@material-ui/core';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import AddPhotoIcon from '@material-ui/icons/AddPhotoAlternate';
import type { Theme } from 'src/theme';
import useAuth from 'src/hooks/useAuth';

interface MailReplyProps {
  className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(3),
    display: 'flex'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  textareaContainer: {
    flexGrow: 1,
    padding: theme.spacing(2)
  },
  textarea: {
    ...theme.typography.body1,
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    border: 'none',
    outline: 'none',
    resize: 'none',
    width: '100%'
  },
  action: {
    marginRight: theme.spacing(1)
  },
  fileInput: {
    display: 'none'
  }
}));

const MailReply: FC<MailReplyProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
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
        className={classes.avatar}
        src={user.avatar}
      />
      <Paper
        className={classes.textareaContainer}
        variant="outlined"
      >
        <TextareaAutosize
          className={classes.textarea}
          onChange={handleChange}
          placeholder="Leave a message"
          rows={3}
          value={value}
        />
        <Box
          display="flex"
          alignItems="center"
          mt={2}
        >
          <Button
            color="secondary"
            variant="contained"
            className={classes.action}
          >
            Send
          </Button>
          <Tooltip title="Attach image">
            <IconButton
              size="small"
              className={classes.action}
              onClick={handleAttach}
            >
              <AddPhotoIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Attach file">
            <IconButton
              size="small"
              className={classes.action}
              onClick={handleAttach}
            >
              <AttachFileIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
      <input
        className={classes.fileInput}
        ref={fileInputRef}
        type="file"
      />
    </div>
  );
}

MailReply.propTypes = {
  className: PropTypes.string
};

export default MailReply;
