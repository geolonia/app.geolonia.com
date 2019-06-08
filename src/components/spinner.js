import React from "react";

export const Spinner = props => {
  return (
    props.loading && (
      <span
        style={{
          position: "absolute",
          marginLeft: -18,
          marginTop: -2
        }}
      >
        <i uk-spinner={"ratio: .5"} />
      </span>
    )
  );
};

export default Spinner;
