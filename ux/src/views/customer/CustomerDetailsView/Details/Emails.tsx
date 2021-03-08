import React, {
  useState,
  useCallback,
  useEffect
} from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  makeStyles
} from '@material-ui/core';
import MaiIcon from '@material-ui/icons/MailOutline';
import axios from 'src/utils/axios';
import type { Theme } from 'src/theme';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import type { CustomerEmail } from 'src/types/customer';

interface EmailsProps {
  className?: string;
}

const emailOptions = [
  'Resend last invoice',
  'Send password reset',
  'Send verification'
];

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  cell: {
    padding: theme.spacing(1)
  }
}));

const Emails: FC<EmailsProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [emailOption, setEmailOption] = useState<string>(emailOptions[0]);
  const [emails, setEmails] = useState<CustomerEmail[]>([]);

  const getMails = useCallback(async () => {
    try {
      const response = await axios.get<{ emails: CustomerEmail[]; }>('/api/customers/1/emails');

      if (isMountedRef.current) {
        setEmails(response.data.emails);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getMails();
  }, [getMails]);

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader title="Send emails" />
      <Divider />
      <CardContent>
        <TextField
          fullWidth
          name="option"
          onChange={(event) => setEmailOption(event.target.value)}
          select
          SelectProps={{ native: true }}
          value={emailOption}
          variant="outlined"
        >
          {emailOptions.map((option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}
        </TextField>
        <Box mt={2}>
          <Button
            variant="contained"
            startIcon={<MaiIcon />}
          >
            Send email
          </Button>
        </Box>
        <Box mt={2}>
          <Table>
            <TableBody>
              {emails.map((email) => (
                <TableRow key={email.id}>
                  <TableCell className={classes.cell}>
                    {moment(email.createdAt).format('DD/MM/YYYY | HH:MM')}
                  </TableCell>
                  <TableCell className={classes.cell}>
                    {email.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </CardContent>
    </Card>
  );
};

Emails.propTypes = {
  className: PropTypes.string,
};

export default Emails;
