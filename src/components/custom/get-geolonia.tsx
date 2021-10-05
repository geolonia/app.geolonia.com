import React, { useState, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import { GeoloniaMap } from '@geolonia/embed-react';
import StyleSelector from '../Data/StyleSelector';
import { __ } from '@wordpress/i18n';

type Props = {
  geojsonId?: string;
}

const innerContainerStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  margin: 'auto auto',
  padding: 0,
  width: '90%',
  height: '90%',
  backgroundColor: '#ffffff',
};

const styleSelectorStyle: React.CSSProperties = {
  margin: '8px',
  paddingLeft: '8px',
  paddingRight: '8px',
  fontSize: '18px',
  height: '36px',
  boxSizing: 'border-box',
  border: '1px solid #cccccc',
  borderRadius: '0',
  outline: 'none',
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 9999,
};

const containerStyle: React.CSSProperties = {
  boxSizing: 'border-box',
  width: '100%',
  height: '150px',
  position: 'absolute',
  bottom: '0px',
  left: '0px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '0 32px',
  margin: 0,
  backgroundColor: '#ffffff',
};

const htmlInputStyle: React.CSSProperties = {
  width: '100%',
  fontSize: '120%',
  fontFamily: 'monospace',
  display: 'block',
  margin: 0,
  marginBottom: '8px',
  color: '#555555',
};

const copyButtonStyle: React.CSSProperties = {
  backgroundColor: '#008CBA',
  border: 'none',
  color: 'white',
  padding: '15px 32px',
  textAlign: 'center',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '14px',
  margin: 0,
  cursor: 'pointer',
};

const closeButtonStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  position: 'absolute',
  top: '-12px',
  right: '-12px',
  display: 'block',
  zIndex: 9999,
  cursor: 'pointer',
  textDecoration: 'none',
  border: 'none',
  padding: 0,
  background: 'none',
};

export const GetGeolonia: React.FC<Props> = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [styleIdentifier, setStyleIdentifier] = useState<string>('geolonia/basic');
  const { geojsonId } = props;

  const handleClickOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return <>
    <Button
      variant="contained"
      color="primary"
      size="large"
      style={{ width: '100%' }}
      onClick={handleClickOpen}
      // no xyz because data-simple-vector fits the bounds
      data-lat=""
      data-lng=""
      data-zoom=""
      data-marker="off"
      data-simple-vector={`geolonia://tiles/custom/${geojsonId}`}
    >
      {__('Get HTML')}
    </Button>

    <Modal open={open} onClose={handleClose} style={{display: 'flex'}}>
      <div style={innerContainerStyle}>
        <GeoloniaMap
          style={{width: '100%', height: 'calc(100% - 150px)'}}
          mapStyle={styleIdentifier}
        />
        <StyleSelector style={styleSelectorStyle} styleIdentifier={styleIdentifier} setStyleIdentifier={setStyleIdentifier} />
        <div style={containerStyle}>
          <input style={htmlInputStyle} />
          <button
            style={copyButtonStyle}
          >{__('Copy to Clipboard')}</button>
        </div>
        <button style={closeButtonStyle} onClick={handleClose}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
            <g fill="none" fillRule="evenodd">
              <circle stroke="#FFF" strokeWidth="2" fill="#D8D8D8" cx="11" cy="11" r="10" />
              <path d="M11 1C5.5 1 1 5.5 1 11s4.5 10 10 10 10-4.5 10-10S16.5 1 11 1zm4.9 13.5l-1.4 1.4-3.5-3.5-3.5 3.5-1.4-1.4L9.6 11 6.1 7.5l1.4-1.4L11 9.6l3.5-3.5 1.4 1.4-3.5 3.5 3.5 3.5z" fill="#000" fillRule="nonzero" />
            </g>
          </svg>
        </button>
      </div>
    </Modal>
  </>;
};
