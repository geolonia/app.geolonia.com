import React from "react";
import styled from "styled-components";
import { __ } from "@wordpress/i18n";

type Props = {
  children: React.ReactNode;
  label?: string;
  style?: React.CSSProperties;
};

const Container = styled.div`
  position: relative;
`;

const Screen = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ComingSoon = (props: Props) => {
  const label = props.label || __("Coming soon");
  return (
    <Container style={props.style}>
      {props.children}
      <Screen>
        <span>{label}</span>
      </Screen>
    </Container>
  );
};

export default ComingSoon;
