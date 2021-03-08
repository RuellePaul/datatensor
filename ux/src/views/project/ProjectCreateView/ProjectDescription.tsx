import React, { useState } from 'react';
import type { FC, FormEvent } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  FormHelperText,
  Paper,
  Typography,
  makeStyles
} from '@material-ui/core';
import QuillEditor from 'src/components/QuillEditor';
import type { Theme } from 'src/theme';

interface ProjectDescriprionProps {
  className?: string;
  onComplete?: () => void;
  onBack?: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  editorContainer: {
    marginTop: theme.spacing(3)
  },
  editor: {
    '& .ql-editor': {
      height: 400
    }
  }
}));

const ProjectDescription: FC<ProjectDescriprionProps> = ({
  className,
  onBack,
  onComplete,
  ...rest
}) => {
  const classes = useStyles();
  const [content, setContent] = useState<string>('');
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (value: string): void => {
    setContent(value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    try {
      setSubmitting(true);

      // NOTE: Make API request

      if (onComplete) {
        onComplete();
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Typography
        variant="h3"
        color="textPrimary"
      >
        Please select one option
      </Typography>
      <Box mt={2}>
        <Typography
          variant="subtitle1"
          color="textSecondary"
        >
          Proin tincidunt lacus sed ante efficitur efficitur.
          Quisque aliquam fringilla velit sit amet euismod.
        </Typography>
      </Box>
      <Paper
        className={classes.editorContainer}
        variant="outlined"
      >
        <QuillEditor
          handleChange={handleChange}
          value={content}
          className={classes.editor}
        />
      </Paper>
      {error && (
        <Box mt={2}>
          <FormHelperText error>
            {FormHelperText}
          </FormHelperText>
        </Box>
      )}
      <Box
        mt={6}
        display="flex"
      >
        {onBack && (
          <Button
            onClick={onBack}
            size="large"
          >
            Previous
          </Button>
        )}
        <Box flexGrow={1} />
        <Button
          color="secondary"
          disabled={isSubmitting}
          type="submit"
          variant="contained"
          size="large"
        >
          Complete
        </Button>
      </Box>
    </form>
  );
};

ProjectDescription.propTypes = {
  className: PropTypes.string,
  onComplete: PropTypes.func,
  onBack: PropTypes.func
};

ProjectDescription.defaultProps = {
  onComplete: () => {},
  onBack: () => {}
};

export default ProjectDescription;
