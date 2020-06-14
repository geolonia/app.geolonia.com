import React from "react";
import fetch from "../../lib/fetch";
import { connect } from "react-redux";
import { Session, AppState, Invoice } from "../../types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import moment from "moment";

type OwnProps = {};
type StateProps = {
  session: Session;
  teamId?: string;
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

  return invoices;
};

function PaymentHistory(props: Props) {
  const invoices = useInvoices(props);
  return (
    <Table className="payment-info">
      <TableBody>
        {invoices.map(({ total, currency, period_start, period_end, id }) => {
          return (
            <TableRow key={id}>
              <TableCell component="th" scope="row">
                {total / 100 + currency.toUpperCase()}
              </TableCell>
              <TableCell>
                {moment(period_start * 1000).toLocaleString()}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export const mapStateToProps = (state: AppState): StateProps => {
  const team = state.team.data[state.team.selectedIndex];
  const { session } = state.authSupport;
  if (team) {
    const { teamId } = team;
    return {
      session,
      teamId
    };
  } else {
    return { session };
  }
};

export default connect(mapStateToProps)(PaymentHistory);
