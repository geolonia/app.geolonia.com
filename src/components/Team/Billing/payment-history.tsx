import React, { useCallback } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconLaunch from '@material-ui/icons/Launch';
import moment from 'moment';
import { __ } from '@wordpress/i18n';
import { useUserLanguage } from '../../../redux/hooks';
import { useGetTeamChargesQuery, useGetTeamInvoicesQuery } from '../../../redux/apis/app-api';

const useInvoices = (teamId: string) => {
  const { data: invoices, isSuccess: invoicesLoaded } = useGetTeamInvoicesQuery(teamId);
  const { data: charges, isSuccess: chargesLoaded } = useGetTeamChargesQuery(teamId);

  const loaded = invoicesLoaded && chargesLoaded;

  return {
    invoices: invoices?.data,
    charges: charges?.data,
    loaded,
  };
};

interface PaymentHistoryInvoiceRowProps {
  invoice: Geolonia.Invoice;
  formatter: ((currency: string) => Intl.NumberFormat);
  charge?: Geolonia.Charge;
}

const PaymentHistoryInvoiceRow: React.FC<PaymentHistoryInvoiceRowProps> = (props) => {
  const {
    invoice,
    formatter,
    charge,
  } = props;

  const {
    total,
    currency,
    paid_at,
    ending_balance,
    starting_balance,
    descriptions,
  } = invoice;

  // const formattedTotal = new Intl.NumberFormat(props.language, {
  //   style: "currency",
  //   currency
  // }).format(Math.abs(total));
  const value =
    (total - (ending_balance || 0) + starting_balance);
  const formattedActualPayment = formatter(currency).format(value);
  // const formattedBalanced = formatter(currency).format(
  //   ((ending_balance || 0) - starting_balance)
  // );

  const paid_date = paid_at === null ? '-' : `${moment(paid_at * 1000).format('YYYY/MM/DD')}`;
  const payment = formattedActualPayment;
  const receipt_url = charge && charge.receipt_url;

  if (!(total > 0 && value > 0)) {
    return null;
  }

  return (
    <TableRow>
      <TableCell>{paid_date}</TableCell>
      <TableCell>
        <ul>
          {descriptions
            .filter((x) => !!x)
            .map((description, index) => (
              <li key={index}>{description}</li>
            ))}
        </ul>
      </TableCell>
      <TableCell>
        {
          charge && charge.refunded ?
            <><del>{payment}</del>{' '}{__('Refunded')}</> :
            <span>{payment}</span>
        }
      </TableCell>
      <TableCell>
        {receipt_url && (
          <a
            href={receipt_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconLaunch />
          </a>
        )}
      </TableCell>
    </TableRow>
  );
};

type PaymentHistoryProps = {
  teamId: string
}

const PaymentHistory: React.FC<PaymentHistoryProps> = (props) => {
  const { teamId } = props;
  const language = useUserLanguage();
  const { invoices, charges, loaded } = useInvoices(teamId);

  const formatter = useCallback((currency: string) =>
    new Intl.NumberFormat(language, { style: 'currency', currency }), [language]);

  if (!loaded || !invoices || !charges) {
    return null;
  }
  if (loaded && invoices.length === 0) {
    return <p>{__('No payment history.')}</p>;
  }
  // const currentBalance =
  //   invoices[0] && invoices[0].ending_balance !== null
  //     ? formatter(invoices[0].currency).format(
  //         -invoices[0].ending_balance / 100
  //       )
  //     : "-";
  return (
    <Table className="payment-info">
      <TableBody>
        {(invoices || []).map((invoice) => {
          const charge = charges.find((charge) => charge.invoice === invoice.id);
          return <PaymentHistoryInvoiceRow
            key={invoice.id}
            invoice={invoice}
            formatter={formatter}
            charge={charge}
          />;
        })}
      </TableBody>
    </Table>
  );
};

export default PaymentHistory;
