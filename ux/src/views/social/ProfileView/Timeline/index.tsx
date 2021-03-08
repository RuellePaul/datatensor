import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Grid,
  makeStyles
} from '@material-ui/core';
import axios from 'src/utils/axios';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import PostAdd from 'src/components/PostAdd';
import PostCard from 'src/components/PostCard';
import type { Profile, Post } from 'src/types/social';
import About from './About';

interface TimelineProps {
  className?: string;
  profile: Profile;
}

const useStyles = makeStyles(() => ({
  root: {}
}));

const Timeline: FC<TimelineProps> = ({ className, profile, ...rest }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [posts, setPosts] = useState<Post[]>([]);

  const getPosts = useCallback(async () => {
    try {
      const response = await axios.get<{ posts: Post[]; }>('/api/social/posts');

      if (isMountedRef.current) {
        setPosts(response.data.posts);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          xs={12}
          md={6}
          lg={4}
        >
          <About profile={profile} />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          lg={8}
        >
          <PostAdd />
          {posts.map((post) => (
            <Box
              mt={3}
              key={post.id}
            >
              <PostCard post={post} />
            </Box>
          ))}
        </Grid>
      </Grid>
    </div>
  );
};

Timeline.propTypes = {
  className: PropTypes.string,
  // @ts-ignore
  profile: PropTypes.object.isRequired
};

export default Timeline;
