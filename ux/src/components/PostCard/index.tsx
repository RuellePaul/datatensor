import React, { useState } from 'react';
import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
// @ts-ignore
import { Lightbox } from 'react-modal-image';
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardHeader,
  CardMedia,
  Divider,
  Link,
  Typography,
  makeStyles
} from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import type { Post } from 'src/types/social';
import Reactions from './Reactions';
import Comment from './Comment';
import CommentAdd from './CommentAdd';

interface PostCardProps {
  className?: string;
  post: Post;
}

const useStyles = makeStyles(() => ({
  root: {},
  date: {
    marginLeft: 6
  },
  media: {
    height: 500,
    backgroundPosition: 'top'
  }
}));

const PostCard: FC<PostCardProps> = ({ className, post, ...rest }) => {
  const classes = useStyles();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <Card
        className={clsx(classes.root, className)}
        {...rest}
      >
        <CardHeader
          avatar={(
            <Avatar
              alt="Person"
              component={RouterLink}
              src={post.author.avatar}
              to="#"
            />
          )}
          disableTypography
          subheader={(
            <Box
              display="flex"
              alignItems="center"
            >
              <AccessTimeIcon fontSize="small" />
              <Typography
                variant="caption"
                color="textSecondary"
                className={classes.date}
              >
                {moment(post.createdAt).fromNow()}
              </Typography>
            </Box>
          )}
          title={(
            <Link
              color="textPrimary"
              component={RouterLink}
              to="#"
              variant="h6"
            >
              {post.author.name}
            </Link>
          )}
        />
        <Box px={3} pb={2}>
          <Typography
            variant="body1"
            color="textPrimary"
          >
            {post.message}
          </Typography>
          {post.media && (
          <Box mt={2}>
            <CardActionArea onClick={() => setSelectedImage(post.media)}>
              <CardMedia
                className={classes.media}
                image={post.media}
              />
            </CardActionArea>
          </Box>
          )}
          <Box
            mt={2}
          >
            <Reactions post={post} />
          </Box>
          <Box my={2}>
            <Divider />
          </Box>
          {post.comments.map((comment) => (
            <Comment
              comment={comment}
              key={comment.id}
            />
          ))}
          <Box my={2}>
            <Divider />
          </Box>
          <CommentAdd />
        </Box>
      </Card>
      {selectedImage && (
        <Lightbox
          large={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
};

PostCard.propTypes = {
  className: PropTypes.string,
  // @ts-ignore
  post: PropTypes.object.isRequired
};

export default PostCard;
