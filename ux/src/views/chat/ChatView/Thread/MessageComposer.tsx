import React, {
  useRef,
  useState
} from 'react';
import type {
  ChangeEvent,
  FC,
  KeyboardEvent
} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Avatar,
  Divider,
  IconButton,
  Input,
  Paper,
  SvgIcon,
  Tooltip,
  makeStyles
} from '@material-ui/core';
import AddPhotoIcon from '@material-ui/icons/AddPhotoAlternate';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { Send as SendIcon } from 'react-feather';
import type { Theme } from 'src/theme';
import useAuth from 'src/hooks/useAuth';

interface MessageComposerProps {
  className?: string;
  disabled?: boolean;
  onSend?: (value: string) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    padding: theme.spacing(1, 2)
  },
  inputContainer: {
    flexGrow: 1,
    marginLeft: theme.spacing(2),
    padding: theme.spacing(1)
  },
  divider: {
    height: 24,
    width: 1
  },
  fileInput: {
    display: 'none'
  }
}));

const MessageComposer: FC<MessageComposerProps> = ({
  className,
  disabled,
  onSend,
  ...rest
}) => {
  const classes = useStyles();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [body, setBody] = useState<string>('');

  const handleAttach = (): void => {
    fileInputRef.current.click();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setBody(event.target.value);
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.keyCode === 13) {
      handleSend();
    }
  };

  const handleSend = (): void => {
    if (!body) {
      return;
    }

    if (onSend) {
      onSend(body);
    }

    setBody('');
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
        variant="outlined"
        className={classes.inputContainer}
      >
        <Input
          disableUnderline
          fullWidth
          value={body}
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          placeholder="Leave a message"
          disabled={disabled}
        />
      </Paper>
      <Tooltip title="Send">
        <span>
          <IconButton
            color="secondary"
            disabled={!body || disabled}
            onClick={handleSend}
          >
            <SvgIcon fontSize="small">
              <SendIcon />
            </SvgIcon>
          </IconButton>
        </span>
      </Tooltip>
      <Divider className={classes.divider} />
      <Tooltip title="Attach photo">
        <span>
          <IconButton
            edge="end"
            onClick={handleAttach}
            disabled={disabled}
          >
            <AddPhotoIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Attach file">
        <span>
          <IconButton
            edge="end"
            onClick={handleAttach}
            disabled={disabled}
          >
            <AttachFileIcon />
          </IconButton>
        </span>
      </Tooltip>
      <input
        className={classes.fileInput}
        ref={fileInputRef}
        type="file"
      />
    </div>
  );
};

MessageComposer.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onSend: PropTypes.func
};

MessageComposer.defaultProps = {
  disabled: false,
  onSend: () => {}
};

export default MessageComposer;
