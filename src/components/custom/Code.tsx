import React from 'react';

type Props = {
  backgroundColor?: string;
  color?: string;
};

const Code: React.FC<Props> = (props) => {
  const style: React.CSSProperties = {
    padding: '16px',
    backgroundColor: props.backgroundColor,
    whiteSpace: 'pre-wrap',
    color: props.color,
    fontSize: '12px',
  };

  const click = (event: any) => {
    const range = document.createRange();
    range.selectNodeContents(event.target);
    const selection = window.getSelection();
    if (selection) {
      selection.addRange(range);
    }
  };

  return (
    <pre style={style} onClick={click}>
      {props.children}
    </pre>
  );
};

Code.defaultProps = {
  backgroundColor: '#444444',
  color: '#ffffff',
};

export default Code;
