import React from "react";

import { MapStylesAPI } from '../../constants'

type Props = {
  setStyle: Function;
  style: string;
};

const Content = (props: Props) => {
  const [styles, setStyles] = React.useState<[]>([])

  React.useEffect(() => {
    fetch(MapStylesAPI)
      .then(res => res.json())
      .then(json => {
        setStyles(json)
      });
  }, [])

  const onChangeHandler = (event: React.FormEvent<HTMLSelectElement>) => {
    props.setStyle(event.currentTarget.value)
  }

  return (
    <>
      <select onChange={onChangeHandler} value={props.style}>{styles.map((item, index) => {
        return <option key={index} value={item}>{item}</option>
      })}</select>
    </>
  );
};

export default Content;
