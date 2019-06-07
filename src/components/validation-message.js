import React from "react";

export const ValidationMessage = props =>
  props.display && (
    <div className={"uk-text-right"}>
      <span className={"uk-text-danger"}>{props.text}</span>
    </div>
  );

export default ValidationMessage;
