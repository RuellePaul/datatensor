import React from 'react';
import type { FC } from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import type { Theme } from 'src/theme';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginBottom: theme.spacing(2),
    '& > a': {
      color: theme.palette.secondary.main
    }
  }
}));

const Paragraph: FC = (props) => {
  const classes = useStyles();

  return (
    <Typography
      variant="body1"
      color="textPrimary"
      className={classes.root}
      {...props}
    />
  );
}

export default Paragraph;
