import React from "react";
import Grid from "@material-ui/core/Grid";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement
} from "@stripe/react-stripe-js";
import StripeElementWrapper from "./stripe-element-wrapper";

export default function StripeElements() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <StripeElementWrapper
          label="Card Number"
          component={CardNumberElement}
        />
      </Grid>
      <Grid item xs={7}>
        <StripeElementWrapper
          label="Expiry (MM / YY)"
          component={CardExpiryElement}
        />
      </Grid>
      <Grid item xs={5}>
        <StripeElementWrapper label="CVC" component={CardCvcElement} />
      </Grid>
    </Grid>
  );
}
