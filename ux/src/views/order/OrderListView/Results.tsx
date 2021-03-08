import React, { useState } from 'react';
import type {
  FC,
  ChangeEvent
} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import moment from 'moment';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  CardHeader,
  Checkbox,
  Divider,
  IconButton,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  Edit as EditIcon,
  ArrowRight as ArrowRightIcon
} from 'react-feather';
import Label from 'src/components/Label';
import GenericMoreButton from 'src/components/GenericMoreButton';
import type { Order, OrderStatus } from 'src/types/order';
import BulkOperations from './BulkOperations';

interface ResultsProps {
  className?: string;
  orders: Order[];
}

const getStatusLabel = (paymentStatus: OrderStatus): JSX.Element => {
  const map = {
    canceled: {
      text: 'Canceled',
      color: 'error'
    },
    completed: {
      text: 'Completed',
      color: 'success'
    },
    pending: {
      text: 'Pending',
      color: 'warning'
    },
    rejected: {
      text: 'Rejected',
      color: 'error'
    }
  };

  const { text, color }: any = map[paymentStatus];

  return (
    <Label color={color}>
      {text}
    </Label>
  );
};

const applyPagination = (orders: Order[], page: number, limit: number): Order[] => {
  return orders.slice(page * limit, page * limit + limit);
};

const useStyles = makeStyles(() => ({
  root: {}
}));

const Results: FC<ResultsProps> = ({ className, orders, ...rest }) => {
  const classes = useStyles();
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);

  const handleSelectAllOrders = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedOrders(event.target.checked
      ? orders.map((order) => order.id)
      : []);
  };

  const handleSelectOneOrder = (event: ChangeEvent<HTMLInputElement>, orderId: string): void => {
    if (!selectedOrders.includes(orderId)) {
      setSelectedOrders((prevSelected) => [...prevSelected, orderId]);
    } else {
      setSelectedOrders((prevSelected) => prevSelected.filter((id) => id !== orderId));
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const paginatedOrders = applyPagination(orders, page, limit);
  const enableBulkOperations = selectedOrders.length > 0;
  const selectedSomeOrders = selectedOrders.length > 0 && selectedOrders.length < orders.length;
  const selectedAllOrders = selectedOrders.length === orders.length;

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Typography
        color="textSecondary"
        gutterBottom
        variant="body2"
      >
        {orders.length}
        {' '}
        Records found. Page
        {' '}
        {page + 1}
        {' '}
        of
        {' '}
        {Math.ceil(orders.length / limit)}
      </Typography>
      <Card>
        <CardHeader
          action={<GenericMoreButton />}
          title="Orders"
        />
        <Divider />
        <PerfectScrollbar>
          <Box minWidth={1150}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedAllOrders}
                      indeterminate={selectedSomeOrders}
                      onChange={handleSelectAllOrders}
                    />
                  </TableCell>
                  <TableCell>
                    Number
                  </TableCell>
                  <TableCell>
                    Customer
                  </TableCell>
                  <TableCell>
                    Method
                  </TableCell>
                  <TableCell>
                    Total
                  </TableCell>
                  <TableCell>
                    Status
                  </TableCell>
                  <TableCell align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedOrders.map((order) => {
                  const isOrderSelected = selectedOrders.includes(order.id);

                  return (
                    <TableRow
                      key={order.id}
                      selected={selectedOrders.indexOf(order.id) !== -1}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isOrderSelected}
                          onChange={(event) => handleSelectOneOrder(event, order.id)}
                          value={isOrderSelected}
                        />
                      </TableCell>
                      <TableCell>
                        {order.number}
                        <Typography
                          variant="body2"
                          color="textSecondary"
                        >
                          {moment(order.createdAt).format('DD MMM YYYY | hh:mm')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {order.customer.name}
                      </TableCell>
                      <TableCell>
                        {order.paymentMethod}
                      </TableCell>
                      <TableCell>
                        {numeral(order.totalAmount).format(`${order.currency}0,0.00`)}
                      </TableCell>
                      <TableCell>
                        {getStatusLabel(order.status)}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton>
                          <SvgIcon fontSize="small">
                            <EditIcon />
                          </SvgIcon>
                        </IconButton>
                        <IconButton
                          component={RouterLink}
                          to="/app/management/orders/1"
                        >
                          <SvgIcon fontSize="small">
                            <ArrowRightIcon />
                          </SvgIcon>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
        <TablePagination
          component="div"
          count={orders.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
      <BulkOperations
        open={enableBulkOperations}
        selected={selectedOrders}
      />
    </div>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  orders: PropTypes.array.isRequired
};

Results.defaultProps = {
  orders: []
};

export default Results;
