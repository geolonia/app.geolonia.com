import React, { useState, useEffect } from 'react';

import { MapStylesAPI } from '../../constants';

type Props = {
  style: string;
  setStyle: React.Dispatch<React.SetStateAction<string>>;
};

const StyleSelector: React.FC<Props> = (props) => {
  const { style, setStyle } = props;
  const [styles, setStyles] = useState<[]>([]);

  useEffect(() => {
    fetch(MapStylesAPI)
      .then((res) => res.json())
      .then((json) => {
        setStyles(json);
      });
  }, []);

  const onChangeHandler = (event: React.FormEvent<HTMLSelectElement>) => {
    setStyle(event.currentTarget.value);
  };

  return (
    <>
      <select onChange={onChangeHandler} value={style}>{styles.map((item, index) => {
        return <option key={index} value={item}>{item}</option>;
      })}</select>
    </>
  );
};

export default StyleSelector;
