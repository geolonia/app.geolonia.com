import React from "react";
import fetch from "../../lib/fetch";
import { connect } from "react-redux";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import moment from "moment";
import { __ } from "@wordpress/i18n";
import Typography from "@material-ui/core/Typography";

type OwnProps = {};
type StateProps = {
  session: Geolonia.Session;
  teamId?: string;
  language: string;
};
type Props = OwnProps & StateProps;

const useInvoices = (props: Props) => {
  const { session, teamId } = props;
  const [loaded, setLoaded] = React.useState(false);
  const [invoices, setInvoices] = React.useState<Geolonia.Invoice[]>([]);

  React.useEffect(() => {
    if (loaded) {
      return;
    } else {
      fetch(
        session,
        `https://api.app.geolonia.com/${process.env.REACT_APP_STAGE}/teams/${teamId}/invoices`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
        .then(res => {
          if (res.status < 400) {
            return res.json();
          } else {
            throw new Error();
          }
        })
        .then(({ data }) => {
          setInvoices(data);
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          setLoaded(true);
        });
    }
  }, [session, teamId, loaded, invoices]);

  return { invoices };
};

function PaymentHistory(props: Props) {
  const { invoices } = useInvoices(props);
  const formatter = (currency: string) =>
    new Intl.NumberFormat(props.language, {
      style: "currency",
      currency
    });
  const currentBalance =
    invoices[0] && invoices[0].ending_balance !== null
      ? formatter(invoices[0].currency).format(
          -invoices[0].ending_balance / 100
        )
      : "-";

  return (
    <>
      <Typography component="h2" className="module-title">
        {__("Balance")}
      </Typography>
      <p style={{ fontSize: 20 }}>{currentBalance}</p>
      <Typography component="h2" className="module-title">
        {__("Payment history")}
      </Typography>
      <Table className="payment-info">
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="column">
              {__("Date")}
            </TableCell>
            <TableCell component="th" scope="column">
              {`${__("Payment")} (${__("Balanced")})`}
            </TableCell>
            <TableCell component="th" scope="column">
              {__("Refund")}
            </TableCell>
          </TableRow>
          {invoices.map(invoice => {
            const {
              total,
              currency,
              period_start,
              ending_balance,
              starting_balance,
              id
            } = invoice;

            const formattedTotal = new Intl.NumberFormat(props.language, {
              style: "currency",
              currency
            }).format(Math.abs(total) / 100);

            const formattedActualPayment = formatter(currency).format(
              (total - (ending_balance || 0) + starting_balance) / 100
            );
            const formattedBalanced = formatter(currency).format(
              ((ending_balance || 0) - starting_balance) / 100
            );

            return (
              <TableRow key={id}>
                <TableCell>
                  {moment(period_start * 1000).format("YYYY-MM-DD HH:mm:ss")}
                </TableCell>
                <TableCell>
                  {total > 0
                    ? `${formattedActualPayment}(${formattedBalanced})`
                    : "-"}
                </TableCell>
                <TableCell>{total < 0 ? formattedTotal : "-"}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
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
