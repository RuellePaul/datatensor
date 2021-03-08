import React from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Grid, makeStyles } from '@material-ui/core';
import ApplicantCard from './ApplicantCard';

interface ApplicantsProps {
  className?: string;
  applicants: any[];
}

const useStyles = makeStyles(() => ({
  root: {}
}));

const Applicants: FC<ApplicantsProps> = ({ className, applicants, ...rest }) => {
  const classes = useStyles();

  return (
    <Grid
      className={clsx(classes.root, className)}
      container
      spacing={3}
      {...rest}
    >
      {applicants.map((applicant) => (
        <Grid
          item
          key={applicant.id}
          lg={4}
          xs={12}
        >
          <ApplicantCard applicant={applicant} />
        </Grid>
      ))}
    </Grid>
  );
};

Applicants.propTypes = {
  className: PropTypes.string,
  applicants: PropTypes.array.isRequired
};

export default Applicants;
