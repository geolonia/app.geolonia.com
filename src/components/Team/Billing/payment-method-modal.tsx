import React, { useState, useCallback } from 'react';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { CircularProgress } from '@material-ui/core';

// Stripe
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

import { __ } from '@wordpress/i18n';
import { useUpdateTeamPaymentMethodMutation } from '../../../redux/apis/app-api';

type Props = {
  open: boolean;
  handleClose: () => void;
  teamId: string;
};

const modalStyle: React.CSSProperties = {
  position: 'absolute',
  minWidth: 600,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: 'white',
  padding: '2em 4em 3em',
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
    <Modal open={open} onClose={handleClose}>
      <div style={modalStyle}>
        <Typography component="h3">{__('Card information')}</Typography>
        <div
          style={{
            margin: '1em 0 1em',
            padding: '3px 1px 2px',
          }}
        >
          <CardElement
            options={{
              hidePostalCode: true,
              style: {
                base: {
                  padding: '16px',
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
        </div>
        <p>{message}</p>
        <Button
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
      </div>
    </Modal>
  );
};

export default PaymentMethodModal;
