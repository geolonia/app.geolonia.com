import React from "react";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Button from "@material-ui/core/Button";
import { __ } from "@wordpress/i18n";
import fetch from "../../lib/fetch";
import { connect } from "react-redux";
import { AppState, Session } from "../../types";

type OwnProps = {
  open: boolean;
  handleClose: () => void;
};
type StateProps = {
  session: Session;
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

const PaymentMethodModal = (props: Props) => {
  const { open, handleClose, session, teamId } = props;
  const [name, setName] = React.useState("");
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

  const handleSubmit = async () => {
    if (!stripe || !elements || !teamId) {
      return null;
    }
    const cardElement = elements.getElement(CardElement);

    if (cardElement) {
      const { error, token } = await stripe.createToken(cardElement, {
        name: "test"
      });
      if (error || !token || !token.card) {
        setMessage(error && error.message ? error.message : "不明なエラーです");
      } else {
        setMessage("");
        fetch(
          session,
          `https://api.app.geolonia.com/${REACT_APP_STAGE}/teams/${teamId}/payment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: token.id, last4: token.card.last4 })
          }
        )
          .then(res => {
            if (res.status < 400) {
              handleClose();
              window.location.reload();
            } else {
              throw new Error();
            }
          })
          .catch(console.error);
      }
    }
  };

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
                  padding: 16,
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
          {__("Update")}
        </Button>
      </div>
    </Modal>
  );
};

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

export default connect(mapStateToProps)(PaymentMethodModal);
