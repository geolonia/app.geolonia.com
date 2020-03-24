import React from "react";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";

const blackOrWhite = (hexcolor: string) => {
	var r = parseInt(hexcolor.substr( 1, 2 ), 16)
	var g = parseInt(hexcolor.substr( 3, 2 ), 16)
	var b = parseInt(hexcolor.substr( 5, 2 ), 16)

	return ( ( ( (r * 299) + (g * 587) + (b * 114) ) / 1000 ) < 128 ) ? "#FFFFFF" : "#000000" ;
}

type Props = {
  color: string;
  className: string;
  name: string;
  onChange: Function;
  onFocus: Function;
};

const InputColor = (props: Props) => {
  const { color, className, name, onChange, onFocus } = props;

  const onChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    onChange(event)
  }

  const onFocusHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    onFocus(event)
  }

  return (
    <>
      <input className={className} type="text" defaultValue={color} name={name} onChange={onChangeHandler} onFocus={onFocusHandler} />
    </>
  );
};

export default InputColor;
