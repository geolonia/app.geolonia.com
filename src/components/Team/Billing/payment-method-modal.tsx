import React, { useCallback } from "react";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { CircularProgress } from "@material-ui/core";

// Stripe
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import { __ } from "@wordpress/i18n";
import fetch from "../../../lib/fetch";
import { connect } from "react-redux";

type OwnProps = {
  open: boolean;
  handleClose: () => void;
};
type StateProps = {
  session: Geolonia.Session;
  teamId?: string;
};
type Props = OwnProps & StateProps;

const modalStyle: React.CSSProperties = {
  position: "absolute",
  minWidth: 600,
  top: `50%`,
  left: `50%`,
  transform: `translate(-50%, -50%)`,
  background: "white",
  padding: "2em 4em 3em"
};

const { REACT_APP_STAGE } = process.env;

const PaymentMethodModal: React.FC<Props> = (props) => {
  const { open, handleClose, session, teamId } = props;
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const stripe = useStripe();
  const elements = useElements();

  if (stripe) {
    // stripe
    //   .retrieveSource({
    //     id: "plan_seat",
    //     client_secret: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY as string
    //   })
    //   .then(console.log);
  }

  const handleSubmit = useCallback(async () => {
    if (!stripe || !elements || !teamId) {
      return null;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;
    setLoading(true);
    const { error, token } = await stripe.createToken(cardElement, {
      name: "test"
    });
    if (error || !token || !token.card) {
      setLoading(false);
      setMessage(
        error && error.message ? error.message : __("Unknown Error.")
      );
      return;
    }

    const last2 = token.card.last4.slice(2, 4);
    setMessage("");

    try {
      const res = await fetch(
        session,
        `https://api.app.geolonia.com/${REACT_APP_STAGE}/teams/${teamId}/payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ token: token.id, last2 })
        }
      )
      if (res.status < 400) {
        handleClose();
        window.location.reload();
      } else {
        throw new Error();
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [ stripe, elements, teamId, handleClose, session ]);

  return (
    <Modal open={open} onClose={handleClose}>
      <div style={modalStyle}>
        <Typography component="h3">{__("Card information")}</Typography>
        <div
          style={{
            margin: "1em 0 1em",
            padding: "3px 1px 2px"
          }}
        >
          <CardElement
            options={{
              hidePostalCode: true,
              style: {
                base: {
                  padding: "16px",
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4"
                  }
                },
                invalid: {
                  color: "#9e2146"
                }
              }
            }}
          />
        </div>
        <p>{message}</p>
        <Button
          variant="contained"
          color="primary"
          onClick={e => {
            e.preventDefault();
            handleSubmit();
            // handleClose();
          }}
          type={"button"}
        >
          {loading && (
            <CircularProgress
              size={16}
              style={{ marginRight: 8 }}
              color={"inherit"}
            />
          )}
          {__("Update")}
        </Button>
      </div>
    </Modal>
  );
};

export const mapStateToProps = (state: Geolonia.Redux.AppState): StateProps => {
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

export default connect(mapStateToProps)(PaymentMethodModal);
