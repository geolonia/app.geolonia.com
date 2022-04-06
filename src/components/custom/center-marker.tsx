import React from 'react';

const centerMarkerStyle: React.CSSProperties = {
  width: '48px',
  height: '48px',
  position: 'absolute',
  top: 'calc(50% - 99px)',
  right: '-10px',
  left: 'calc(50% - 24px)',
  pointerEvents: 'none',
};

export const CenterMarker = () => {
  return <div style={centerMarkerStyle}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66 67">
      <g transform="translate(2 2)" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
        <circle stroke="#FFF" strokeWidth="4" cx="31.5" cy="31.17" r="24.5" />
        <circle stroke="#FFF" strokeWidth="4" cx="31.5" cy="31.17" r="10.07" />
        <path stroke="#FFF" strokeWidth="4" d="M31 14.88V.04M31 62.05V47.22M47.17 31.05H62M0 31.05h14.83" />
        <circle stroke="#000" strokeWidth="2" cx="31.5" cy="31.17" r="24.5" />
        <circle stroke="#000" strokeWidth="2" cx="31.5" cy="31.17" r="10.07" />
        <path stroke="#000" strokeWidth="2" d="M31 14.88V.04M31 62.05V47.22M47.17 31.05H62M0 31.05h14.83" />
      </g>
    </svg>
  </div>;
};
