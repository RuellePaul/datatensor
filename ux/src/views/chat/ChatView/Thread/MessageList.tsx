import React, {
  useEffect,
  useRef
} from 'react';
import type { FC } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import type { Theme } from 'src/theme';
import type { Thread } from 'src/types/chat';
import MessageItem from './MessageItem';

interface MessageListProps {
  className?: string;
  thread: Thread;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}));

const MessageList: FC<MessageListProps> = ({
  className,
  thread,
  ...rest
}) => {
  const classes = useStyles();
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    const scrollMessagesToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current._container.scrollTop = scrollRef.current._container.scrollHeight;
      }
    };

    scrollMessagesToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thread.messages]);

  return (
    <PerfectScrollbar
      className={clsx(classes.root, className)}
      options={{ suppressScrollX: true }}
      ref={scrollRef}
      {...rest}
    >
      {thread.messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          thread={thread}
        />
      ))}
    </PerfectScrollbar>
  );
};

MessageItem.propTypes = {
  className: PropTypes.string,
  // @ts-ignore
  thread: PropTypes.object.isRequired
};

export default MessageList;
