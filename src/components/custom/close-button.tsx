import React from 'react';

type Props = {
  onClick: () => void;
}

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

/** A close button which snaps right-top against the parent. */
export const CloseButton: React.FC<Props> = (props) => {
  const { onClick } = props;
  return <button style={closeButtonStyle} onClick={onClick}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
      <g fill="none" fillRule="evenodd">
        <circle stroke="#FFF" strokeWidth="2" fill="#D8D8D8" cx="11" cy="11" r="10" />
        <path d="M11 1C5.5 1 1 5.5 1 11s4.5 10 10 10 10-4.5 10-10S16.5 1 11 1zm4.9 13.5l-1.4 1.4-3.5-3.5-3.5 3.5-1.4-1.4L9.6 11 6.1 7.5l1.4-1.4L11 9.6l3.5-3.5 1.4 1.4-3.5 3.5 3.5 3.5z" fill="#000" fillRule="nonzero" />
      </g>
    </svg>
  </button>;
};
