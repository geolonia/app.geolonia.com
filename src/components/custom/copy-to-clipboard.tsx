import React, { useCallback, useContext } from 'react';
import { context as NotificationContext} from '../../contexts/notification';
import Button from '@material-ui/core/Button';

import * as clipboard from 'clipboard-polyfill';
import { __ } from '@wordpress/i18n';

type Props = {
  value?: string;
  target?: string;
};

// TODO: add a feedback
export const CopyToClipboard: React.FC<Props> = (props) => {

  const { value, target } = props;
  const { updateState: updateNotificationState } = useContext(NotificationContext);

  const handleClick = useCallback(() => {
    let text: string | undefined = undefined;
    if (target) {
      const input = document.getElementById(target);
      if (input && (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement)) {
        input.select();
        text = input.value;
      }
    }

    if (!text) {
      text = value || '';
    }
    clipboard.writeText(text);
    updateNotificationState({ open: true, message: __('Copied to the clipboard.'), type: 'success' });
  }, [target, updateNotificationState, value]);

  return <p>
    <Button
      variant="contained"
      color="primary"
      size="large"
      style={{ width: '100%' }}
      onClick={handleClick}
    >
      {__('Copy to Clipboard')}
    </Button>
  </p>;
};
