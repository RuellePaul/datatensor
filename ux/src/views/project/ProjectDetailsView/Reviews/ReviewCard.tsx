import React from 'react';
import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Link,
  Typography,
  makeStyles
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import type { Theme } from 'src/theme';
import getInitials from 'src/utils/getInitials';
import type { ProjectReview } from 'src/types/project';

interface ReviewCardProps {
  className?: string;
  review: ProjectReview;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  value: {
    marginLeft: theme.spacing(1),
    fontWeight: theme.typography.fontWeightBold
  }
}));

const ReviewCard: FC<ReviewCardProps> = ({ className, review, ...rest }) => {
  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader
        avatar={(
          <Avatar
            alt="Reviewer"
            src={review.author.avatar}
          >
            {getInitials(review.author.name)}
          </Avatar>
        )}
        disableTypography
        subheader={(
          <Box
            flexWrap="wrap"
            display="flex"
            alignItems="center"
          >
            <Box
              display="flex"
              alignItems="center"
              mr={1}
            >
              <Rating
                readOnly
                value={review.value}
              />
              <Typography
                className={classes.value}
                variant="h6"
              >
                {review.value}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              color="textSecondary"
            >
              | For
              {' '}
              <Link
                color="textPrimary"
                variant="h6"
              >
                Low Budget
              </Link>
              {' '}
              |
              {' '}
              {moment(review.createdAt).fromNow()}
            </Typography>
          </Box>
        )}
        title={(
          <Link
            color="textPrimary"
            component={RouterLink}
            to="#"
            variant="h5"
          >
            {review.author.name}
          </Link>
        )}
      />
      <Box
        pb={2}
        px={3}
      >
        <Typography
          variant="body2"
          color="textSecondary"
        >
          {review.comment}
        </Typography>
      </Box>
    </Card>
  );
};

ReviewCard.propTypes = {
  className: PropTypes.string,
  // @ts-ignore
  review: PropTypes.object.isRequired
};

export default ReviewCard;
