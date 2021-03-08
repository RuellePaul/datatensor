import React from 'react';
import type { FC } from 'react';
import { Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import type { Theme } from 'src/theme';
import Header from './Header';
import ProductCreateForm from './ProductCreateForm';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: 100
  }
}));

const ProductCreateView: FC = () => {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Product Create"
    >
      <Container maxWidth="lg">
        <Header />
        <ProductCreateForm />
      </Container>
    </Page>
  );
};

export default ProductCreateView;
