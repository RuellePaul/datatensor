import React from 'react';
import type {
  FC,
  ReactElement,
  ReactNode
} from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  SvgIcon,
  makeStyles
} from '@material-ui/core';
import type { ButtonProps } from '@material-ui/core';
import type { Theme } from 'src/theme';

interface ActionButtonProps extends ButtonProps {
  icon?: ReactElement;
  children?: ReactNode;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    justifyContent: 'flex-start',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));

const ActionButton: FC<ActionButtonProps> = ({
  icon: iconProp,
  children,
  ...rest
}) => {
  const classes = useStyles();

  const Icon = iconProp ? (
    <SvgIcon fontSize="small">
      {iconProp}
    </SvgIcon>
  ) : null;

  return (
    <Button
      className={classes.root}
      fullWidth
      variant="contained"
      size="small"
      startIcon={Icon}
      {...rest}
    >
      {children}
    </Button>
  );
};

ActionButton.propTypes = {
  icon: PropTypes.element,
  children: PropTypes.node
};

export default ActionButton;
