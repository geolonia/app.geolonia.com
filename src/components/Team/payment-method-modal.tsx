import React from "react";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import Input from "@material-ui/core/Input";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Button from "@material-ui/core/Button";
import { __ } from "@wordpress/i18n";
import fetch from "../../lib/";

type Props = {
  open: boolean;
  handleClose: () => void;
};

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

export default function PaymentMethodModal(props: Props) {
  const { open, handleClose } = props;
  const [name, setName] = React.useState("");
  const [message, setMessage] = React.useState("");
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      return null;
    }
    const cardElement = elements.getElement(CardElement);

    if (cardElement) {
      const { error, token } = await stripe.createToken(cardElement, {
        name: "test"
      });
      if (error || !token) {
        setMessage(error && error.message ? error.message : "不明なエラーです");
      } else {
        setMessage("");
        fetch(
          `https://api.app.geolonia.com/${REACT_APP_STAGE}/teams/${teamId}/payment`
        );
        // TODO
        // - /teams/:teamId/payment を作って、トークンと最後の4けたを送る
        //  - customerId がなければ
      }
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div style={modalStyle}>
        <Typography component="h3">{__("Card information")}</Typography>

        <Input
          value={name}
          onChange={e => setName(e.currentTarget.value)}
        ></Input>
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
}
