import React from 'react';

type Props= {
  children: string,
}

const Code = (props: Props) => {
  const style = {
    padding: '16px',
    backgroundColor: '#555555',
    whiteSpace: 'pre-wrap',
    color: '#ffffff',
  } as React.CSSProperties

  const click = (event: any) => {
    const range = document.createRange()
    range.selectNodeContents(event.target)
    const selection = window.getSelection()
    if (selection) {
      selection.addRange(range)
    }
  }

  return (
    <pre style={style} onClick={click}>{props.children}</pre>
  );
}

export default Code;
