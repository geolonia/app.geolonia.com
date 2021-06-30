import React, { useState, useEffect } from "react";
import fetch from "../../../lib/fetch";
import { connect } from "react-redux";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import IconLaunch from "@material-ui/icons/Launch";
import moment from "moment";
import { __ } from "@wordpress/i18n";
import { buildApiAppUrl } from "../../../lib/api";

type OwnProps = {};
type StateProps = {
  session: Geolonia.Session;
  teamId?: string;
  language: string;
};
type Props = OwnProps & StateProps;

const useInvoices = (props: Props) => {
  const { session, teamId } = props;
  const [loaded, setLoaded] = useState(false);
  const [invoices, setInvoices] = useState<Geolonia.Invoice[]>([]);
  const [charges, setCharges] = useState<Geolonia.Charge[]>([]);

  // チーム変えたらロード状態をリセット
  useEffect(() => {
    (async () => {
      if (!session) return;

      setLoaded(false);
      setInvoices([]);
      setCharges([]);

      if (!teamId) return;

      const headers = {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      };
      const urlBase = buildApiAppUrl(`/teams/${teamId}`);

      const loadInvoices = async () => {
        const resp = await fetch(session, `${urlBase}/invoices`, headers)
        if (resp.status >= 400) {
          throw new Error(`response error: ${resp.status}`);
        }
        const invoices = await resp.json();
        setInvoices(invoices.data);
      }

      const loadCharges = async () => {
        const resp = await fetch(session, `${urlBase}/charges`, headers)
        if (resp.status >= 400) {
          throw new Error(`response error: ${resp.status}`);
        }
        const charges = await resp.json();
        setCharges(charges.data);
      }

      try {
        await Promise.all([
          loadInvoices(),
          loadCharges(),
        ])
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        setLoaded(true);
      }
    })();
  }, [teamId, session]);

  return { invoices, charges, loaded };
};

interface PaymentHistoryInvoiceRowProps {
  invoice: Geolonia.Invoice;
  formatter: ((currency: string) => Intl.NumberFormat);
  charges: Geolonia.Charge[];
}

const PaymentHistoryInvoiceRow: React.FC<PaymentHistoryInvoiceRowProps> = (props) => {
  const {
    invoice,
    formatter,
    charges,
  } = props;

  const {
    total,
    currency,
    period_start,
    ending_balance,
    starting_balance,
    id,
    descriptions,
  } = invoice;

  // const formattedTotal = new Intl.NumberFormat(props.language, {
  //   style: "currency",
  //   currency
  // }).format(Math.abs(total) / 100);
  const value =
    (total - (ending_balance || 0) + starting_balance) / 100;
  const formattedActualPayment = formatter(currency).format(value);
  // const formattedBalanced = formatter(currency).format(
  //   ((ending_balance || 0) - starting_balance) / 100
  // );

  const charge = charges.find(charge => charge.invoice === id);
  const date = moment(period_start * 1000).format("YYYY-MM-DD");
  const payment = formattedActualPayment;
  const receipt_url = charge && charge.receipt_url;

  if (!(total > 0 && value > 0)) {
    return null
  }

  return (
    <TableRow>
      <TableCell>{date}</TableCell>
      <TableCell>
        <ul>
          {descriptions
            .filter(x => !!x)
            .map((description, index) => (
              <li key={index}>{description}</li>
            ))}
        </ul>
      </TableCell>
      <TableCell>{payment}</TableCell>
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
}

const PaymentHistory: React.FC<Props> = (props) => {
  const { invoices, charges, loaded } = useInvoices(props);
  const formatter = (currency: string) =>
    new Intl.NumberFormat(props.language, { style: "currency", currency });
  if (!loaded && invoices.length === 0) {
    return null;
  }
  if (loaded && invoices.length === 0) {
    return <p>{__("No payment history.")}</p>;
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
        {invoices.map(invoice => <PaymentHistoryInvoiceRow
          key={invoice.id}
          invoice={invoice}
          formatter={formatter}
          charges={charges}
        />)}
      </TableBody>
    </Table>
  );
}

export const mapStateToProps = (state: Geolonia.Redux.AppState): StateProps => {
  const team = state.team.data[state.team.selectedIndex];
  const language = state.userMeta.language;
  const { session } = state.authSupport;
  if (team) {
    const { teamId } = team;
    return {
      session,
      teamId,
      language
    };
  } else {
    return { session, language };
  }
};

export default connect(mapStateToProps)(PaymentHistory);
