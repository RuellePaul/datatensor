import React from 'react';
import type { FC } from 'react';
import { makeStyles } from '@material-ui/core';
import type { Theme } from 'src/theme';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    borderLeft: `4px solid ${theme.palette.text.secondary}`,
    '& > p': {
      color: theme.palette.text.secondary,
      marginBottom: 0
    }
  }
}));

const Blockquote: FC = (props) => {
  const classes = useStyles();

  return (
    <blockquote
      className={classes.root}
      {...props}
    />
  );
};

export default Blockquote;
