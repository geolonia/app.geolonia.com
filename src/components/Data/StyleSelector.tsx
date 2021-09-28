import React, { useState, useEffect } from 'react';

import { MapStylesAPI } from '../../constants';

type Props = {};

const StyleSelector: React.FC<Props> = () => {
  const [styles, setStyles] = useState<[]>([]);
  const [style, setStyle] = useState<string | undefined>();

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
