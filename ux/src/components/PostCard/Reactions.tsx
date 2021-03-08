import React, { useState } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  colors,
  makeStyles
} from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ShareIcon from '@material-ui/icons/Share';
import type { Post } from 'src/types/social';

interface ReactionsProps {
  className?: string;
  post: Post;
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  likedButton: {
    color: colors.red[600]
  }
}));

const Reactions: FC<ReactionsProps> = ({ className, post, ...rest }) => {
  const classes = useStyles();
  const [isLiked, setLiked] = useState<boolean>(post.isLiked);
  const [likes, setLikes] = useState<number>(post.likes);

  const handleLike = (): void => {
    setLiked(true);
    setLikes((prevLikes) => prevLikes + 1);
  };

  const handleUnlike = (): void => {
    setLiked(false);
    setLikes((prevLikes) => prevLikes - 1);
  };

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      {isLiked ? (
        <Tooltip title="Unlike">
          <IconButton
            className={classes.likedButton}
            onClick={handleUnlike}
          >
            <FavoriteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Like">
          <IconButton onClick={handleLike}>
            <FavoriteBorderIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      <Typography
        color="textSecondary"
        variant="h6"
      >
        {likes}
      </Typography>
      <Box flexGrow={1} />
      <IconButton>
        <ShareIcon fontSize="small" />
      </IconButton>
    </div>
  );
};

Reactions.propTypes = {
  className: PropTypes.string,
  // @ts-ignore
  post: PropTypes.object.isRequired
};

export default Reactions;
