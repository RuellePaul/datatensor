import React, {FC, useCallback, useEffect, useState} from 'react';
import {Box, Container, makeStyles} from '@material-ui/core';
import api from 'src/utils/api';
import {Theme} from 'src/theme';
import Page from 'src/components/Page';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import {Customer} from 'src/types/customer';
import CustomerEditForm from './CustomerEditForm';
import Header from './Header';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    }
}));

const CustomerEditView: FC = () => {
    const classes = useStyles();
    const isMountedRef = useIsMountedRef();
    const [customer, setCustomer] = useState<Customer | null>(null);

    const getCustomer = useCallback(async () => {
        try {
            const response = await api.get<{ customer: Customer; }>('/api/customers/1');

            if (isMountedRef.current) {
                setCustomer(response.data.customer);
            }
        } catch (err) {
            console.error(err);
        }
    }, [isMountedRef]);

    useEffect(() => {
        getCustomer();
    }, [getCustomer]);

    if (!customer) {
        return null;
    }

    return (
        <Page
            className={classes.root}
            title="User Edit"
        >
            <Container maxWidth={false}>
                <Header/>
            </Container>
            <Box mt={3}>
                <Container maxWidth="lg">
                    <CustomerEditForm customer={customer}/>
                </Container>
            </Box>
        </Page>
    );
};

export default CustomerEditView;
