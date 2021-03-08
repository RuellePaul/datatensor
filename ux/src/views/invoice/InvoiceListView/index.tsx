import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import type { FC } from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import type { Theme } from 'src/theme';
import axios from 'src/utils/axios';
import Page from 'src/components/Page';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import type { Invoice } from 'src/types/invoice';
import Header from './Header';
import Results from './Results';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: 100
  }
}));

const InvoiceListView: FC = () => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const getInvoices = useCallback(async () => {
    try {
      const response = await axios.get<{ invoices: Invoice[]; }>('/api/invoices');

      if (isMountedRef.current) {
        setInvoices(response.data.invoices);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getInvoices();
  }, [getInvoices]);

  return (
    <Page
      className={classes.root}
      title="Invoice List"
    >
      <Container maxWidth={false}>
        <Header />
        <Box mt={3}>
          <Results invoices={invoices} />
        </Box>
      </Container>
    </Page>
  );
};

export default InvoiceListView;
