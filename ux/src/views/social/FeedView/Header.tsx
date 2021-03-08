import React from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Typography, makeStyles } from '@material-ui/core';

interface HeaderProps {
  className?: string;
}

const useStyles = makeStyles(() => ({
  root: {}
}));

const Header: FC<HeaderProps> = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Typography
        variant="overline"
        color="textSecondary"
      >
        Social Feed
      </Typography>
      <Typography
        variant="h3"
        color="textPrimary"
      >
        Here&apos;s what your connections posted
      </Typography>
    </div>
  );
};

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
