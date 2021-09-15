import React, { useState, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import { CircularProgress } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

// Stripe
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

import { __ } from '@wordpress/i18n';
import { useUpdateTeamPaymentMethodMutation } from '../../../redux/apis/app-api';

type Props = {
  open: boolean;
  handleClose: () => void;
  teamId: string;
};

const PaymentMethodModal: React.FC<Props> = (props) => {
  const { open, handleClose, teamId } = props;
  const [ updatePaymentMethod ] = useUpdateTeamPaymentMethodMutation();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = useCallback(async () => {
    if (!stripe || !elements) {
      return null;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;
    setLoading(true);
    const { error, token } = await stripe.createToken(cardElement, {
      name: 'test',
    });
    if (error || !token || !token.card) {
      setLoading(false);
      setMessage(
        error && error.message ? error.message : __('Unknown Error.'),
      );
      return;
    }

    const last2 = token.card.last4.slice(2, 4);
    setMessage('');
    await updatePaymentMethod({
      teamId,
      token: token.id,
      last2,
    });
    setLoading(false);
    handleClose();
  }, [stripe, elements, updatePaymentMethod, teamId, handleClose]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth={true}
      aria-labelledby={'register-payment-method'}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle id={'register-payment-method'}>{__('Card information')}</DialogTitle>
        <DialogContent>
          <CardElement
            options={{
              hidePostalCode: true,
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
          <p>{message}</p>
        </DialogContent>
        <DialogActions>
          <Button
            style={{marginRight: 24}}
            variant="contained"
            color="primary"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            // handleClose();
            }}
            type={'button'}
          >
            {loading && (
              <CircularProgress
                size={16}
                style={{ marginRight: 8 }}
                color={'inherit'}
              />
            )}
            {__('Update')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PaymentMethodModal;
