import React from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import ReactQuill from 'react-quill';
import { makeStyles } from '@material-ui/core';
import type { Theme } from 'src/theme';

// NOTE: At this moment, this ReactQuill does not export
// the types for props and we cannot extend them
interface QuillEditorProps {
  className?: string;
  [key: string]: any;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& .ql-toolbar': {
      borderLeft: 'none',
      borderTop: 'none',
      borderRight: 'none',
      borderBottom: `1px solid ${theme.palette.divider}`,
      '& .ql-picker-label:hover': {
        color: theme.palette.secondary.main
      },
      '& .ql-picker-label.ql-active': {
        color: theme.palette.secondary.main
      },
      '& .ql-picker-item:hover': {
        color: theme.palette.secondary.main
      },
      '& .ql-picker-item.ql-selected': {
        color: theme.palette.secondary.main
      },
      '& button:hover': {
        color: theme.palette.secondary.main,
        '& .ql-stroke': {
          stroke: theme.palette.secondary.main
        }
      },
      '& button:focus': {
        color: theme.palette.secondary.main,
        '& .ql-stroke': {
          stroke: theme.palette.secondary.main
        }
      },
      '& button.ql-active': {
        '& .ql-stroke': {
          stroke: theme.palette.secondary.main
        }
      },
      '& .ql-stroke': {
        stroke: theme.palette.text.primary
      },
      '& .ql-picker': {
        color: theme.palette.text.primary
      },
      '& .ql-picker-options': {
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.default,
        border: 'none',
        boxShadow: theme.shadows[10],
        borderRadius: theme.shape.borderRadius
      }
    },
    '& .ql-container': {
      border: 'none',
      '& .ql-editor': {
        fontFamily: theme.typography.fontFamily,
        fontSize: 16,
        color: theme.palette.text.primary,
        '&.ql-blank::before': {
          color: theme.palette.text.secondary
        }
      }
    }
  }
}));

const QuillEditor: FC<QuillEditorProps> = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    // @ts-ignore
    <ReactQuill
      className={clsx(classes.root, className)}
      {...rest}
    />
  );
};

QuillEditor.propTypes = {
  className: PropTypes.string
};

export default QuillEditor;
