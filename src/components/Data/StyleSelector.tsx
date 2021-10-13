import React, { useState, useEffect } from 'react';

import { MapStylesAPI } from '../../constants';

type Props = {
  style?: React.CSSProperties;
  styleIdentifier: string;
  setStyleIdentifier: React.Dispatch<React.SetStateAction<string>>;
};

const StyleSelector: React.FC<Props> = (props) => {
  const { style, styleIdentifier, setStyleIdentifier } = props;
  const [styles, setStyles] = useState<[]>([]);

  useEffect(() => {
    fetch(MapStylesAPI)
      .then((res) => res.json())
      .then((json) => {
        setStyles(json);
      });
  }, []);

  const onChangeHandler = (event: React.FormEvent<HTMLSelectElement>) => {
    setStyleIdentifier(event.currentTarget.value);
  };

  return (
    <>
      <select style={style} onChange={onChangeHandler} value={styleIdentifier}>{styles.map((item, index) => {
        return <option key={index} value={item}>{item}</option>;
      })}</select>
    </>
  );
};

export default StyleSelector;
