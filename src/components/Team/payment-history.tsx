import React from "react";
import fetch from "../../lib/fetch";
import { connect } from "react-redux";
import { Session, AppState, Invoice } from "../../types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import moment from "moment";
import { __ } from "@wordpress/i18n";

type OwnProps = {};
type StateProps = {
  session: Session;
  teamId?: string;
  language: string;
};
type Props = OwnProps & StateProps;

const useInvoices = (props: Props) => {
  const { session, teamId } = props;
  const [loaded, setLoaded] = React.useState(false);
  const [invoices, setInvoices] = React.useState<Invoice[]>([]);

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
  return (
    <>
      <Table className="payment-info">
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="column">
              {__("Date")}
            </TableCell>
            <TableCell component="th" scope="column">
              {__("Payment")}
            </TableCell>
            <TableCell component="th" scope="column">
              {__("Balanced")}
            </TableCell>
            <TableCell component="th" scope="column">
              {__("Refund")}
            </TableCell>
            <TableCell component="th" scope="column">
              {__("Balance")}
            </TableCell>
          </TableRow>
          {invoices.map(invoice => {
            const {
              total,
              currency,
              period_start,
              period_end,
              ending_balance,
              starting_balance,
              id
            } = invoice;

            const formattedTotal = new Intl.NumberFormat(props.language, {
              style: "currency",
              currency
            }).format(Math.abs(total) / 100);

            const formattedEndingBalance =
              ending_balance === null
                ? ""
                : ending_balance === 0
                ? "-"
                : new Intl.NumberFormat(props.language, {
                    style: "currency",
                    currency
                  }).format(-ending_balance / 100);
            const formattedActualPayment = new Intl.NumberFormat(
              props.language,
              {
                style: "currency",
                currency
              }
            ).format((total - (ending_balance || 0) + starting_balance) / 100);
            const formattedBalanced = new Intl.NumberFormat(props.language, {
              style: "currency",
              currency
            }).format(((ending_balance || 0) - starting_balance) / 100);

            return (
              <TableRow key={id}>
                <TableCell>
                  {moment(period_start * 1000).format("YYYY-MM-DD HH:mm:ss")}
                </TableCell>
                <TableCell>
                  {total > 0 ? formattedActualPayment : "-"}
                </TableCell>
                <TableCell>{total > 0 ? formattedBalanced : "-"}</TableCell>
                <TableCell>{total < 0 ? formattedTotal : "-"}</TableCell>
                <TableCell>{formattedEndingBalance}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}

export const mapStateToProps = (state: AppState): StateProps => {
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
