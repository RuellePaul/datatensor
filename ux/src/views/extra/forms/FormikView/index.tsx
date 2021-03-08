import React from 'react';
import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Container,
  Grid,
  Link,
  Typography,
  makeStyles
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import type { Theme } from 'src/theme';
import Page from 'src/components/Page';
import BasicForm from './BasicForm';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const FormikView: FC = () => {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Formik Form"
    >
      <Container maxWidth="lg">
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Link
            variant="body1"
            color="inherit"
            to="/app"
            component={RouterLink}
          >
            Dashboard
          </Link>
          <Typography
            variant="body1"
            color="textPrimary"
          >
            Forms
          </Typography>
        </Breadcrumbs>
        <Typography
          variant="h3"
          color="textPrimary"
        >
          Formik
        </Typography>
        <Box mt={3}>
          <Grid container>
            <Grid
              item
              xs={12}
              md={6}
            >
              <BasicForm />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Page>
  );
};

export default FormikView;
